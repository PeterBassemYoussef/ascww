import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { buildSearchApiUrl, normalizeSearchPayload, type SearchResultItem } from '../utils/helpers';

function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLElement | null>(null);
    const desktopMenuRef = useRef<HTMLElement | null>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const searchFormRef = useRef<HTMLFormElement | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        menuRef.current?.querySelectorAll('details[open]').forEach((details) => {
            details.removeAttribute('open');
        });

        const nav = desktopMenuRef.current;
        if (!nav) return;

        nav.querySelectorAll<HTMLElement>('.nav-dropdown').forEach((dropdown) => {
            dropdown.classList.remove('is-open');
            const menu = dropdown.querySelector<HTMLElement>('.nav-dropdown-menu');
            if (!menu) return;
            menu.style.display = 'none';
            menu.style.visibility = 'hidden';
            menu.style.pointerEvents = 'none';
            menu.style.overflow = 'hidden';
            menu.style.height = '0px';
        });
    }, [location.pathname]);

    useEffect(() => {
        if (!isSearchOpen) return;

        const onMouseDown = (event: MouseEvent) => {
            const target = event.target as Node | null;
            if (!target) return;
            if (searchFormRef.current?.contains(target)) return;
            setIsSearchOpen(false);
        };

        document.addEventListener('mousedown', onMouseDown);
        return () => {
            document.removeEventListener('mousedown', onMouseDown);
        };
    }, [isSearchOpen]);

    useEffect(() => {
        const previousBodyOverflow = document.body.style.overflow;

        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = previousBodyOverflow;
            menuRef.current?.querySelectorAll('details[open]').forEach((details) => {
                details.removeAttribute('open');
            });
        }

        return () => {
            document.body.style.overflow = previousBodyOverflow;
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        if (!isMobileMenuOpen) return;

        const onMouseDown = (event: MouseEvent) => {
            const target = event.target as Node | null;
            if (!target) return;
            if (toggleRef.current?.contains(target)) return;
            if (menuRef.current?.contains(target)) return;
            setIsMobileMenuOpen(false);
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const trimmed = searchTerm.trim();
        if (trimmed.length < 2) {
            setSearchResults([]);
            setIsSearching(false);
            setSearchError(null);
            setIsSearchOpen(false);
            return;
        }

        const controller = new AbortController();
        const timerId = window.setTimeout(async () => {
            setIsSearching(true);
            setSearchError(null);

            try {
                const response = await fetch(buildSearchApiUrl(trimmed), {
                    signal: controller.signal,
                });
                if (!response.ok) {
                    throw new Error(`Search request failed with status ${response.status}`);
                }

                const payload = (await response.json()) as unknown;
                setSearchResults(normalizeSearchPayload(payload));
                setIsSearchOpen(true);
            } catch (error) {
                if ((error as Error).name === 'AbortError') return;
                setSearchResults([]);
                setSearchError('تعذر تنفيذ البحث الآن. حاول مرة أخرى.');
                setIsSearchOpen(true);
            } finally {
                setIsSearching(false);
            }
        }, 350);

        return () => {
            window.clearTimeout(timerId);
            controller.abort();
        };
    }, [searchTerm]);

    const displayResults = useMemo(() => searchResults.slice(0, 8), [searchResults]);
    const hasResults = displayResults.length > 0;
    const hasSearchFeedback = isSearching || searchError || searchTerm.trim().length >= 2;

    useEffect(() => {
        const nav = desktopMenuRef.current;
        if (!nav) return;

        const dropdowns = Array.from(nav.querySelectorAll<HTMLElement>('.nav-dropdown'));
        if (!dropdowns.length) return;

        const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const openDelay = 0;
        const closeDelay = prefersReducedMotion ? 0 : 450;
        const slideDuration = prefersReducedMotion ? 1 : 400;
        const openTimers = new WeakMap<HTMLElement, number>();
        const closeTimers = new WeakMap<HTMLElement, number>();
        const animationFrames = new WeakMap<HTMLElement, number>();
        const submenuHandlers = new Map<
            HTMLElement,
            { menus: HTMLElement[]; triggers: HTMLElement[]; onEnter: () => void; onLeave: () => void; onTriggerFocus: (event: FocusEvent) => void; onTriggerBlur: (event: FocusEvent) => void; onTriggerKeyDown: (event: KeyboardEvent) => void }
        >();
        const handlers = new Map<
            HTMLElement,
            {
                onMouseEnter: () => void;
                onMouseLeave: () => void;
                onFocusIn: () => void;
                onFocusOut: (event: FocusEvent) => void;
                onTriggerKeyDown: (event: KeyboardEvent) => void;
                onMenuKeyDown: (event: KeyboardEvent) => void;
            }
        >();

        const easeSwing = (progress: number) => 0.5 - Math.cos(progress * Math.PI) / 2;

        const clearTimer = (timerMap: WeakMap<HTMLElement, number>, dropdown: HTMLElement) => {
            const timerId = timerMap.get(dropdown);
            if (timerId === undefined) return;
            window.clearTimeout(timerId);
            timerMap.delete(dropdown);
        };

        const getTrigger = (dropdown: HTMLElement) => dropdown.querySelector<HTMLElement>('.nav-dropdown-trigger');
        const getMenu = (dropdown: HTMLElement) => dropdown.querySelector<HTMLElement>('.nav-dropdown-menu');

        const setExpandedState = (dropdown: HTMLElement, menu: HTMLElement, expanded: boolean) => {
            const trigger = getTrigger(dropdown);
            if (trigger) {
                trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
                trigger.setAttribute('aria-haspopup', 'menu');
                if (menu.id) {
                    trigger.setAttribute('aria-controls', menu.id);
                }
            }
            menu.setAttribute('aria-hidden', expanded ? 'false' : 'true');
        };

        const setMenuItemRoles = (menu: HTMLElement) => {
            menu.querySelectorAll<HTMLElement>(focusableSelector).forEach((item) => {
                if (!item.hasAttribute('role')) {
                    item.setAttribute('role', 'menuitem');
                }
            });
        };

        const focusMenuItem = (menu: HTMLElement, direction: 'first' | 'last' | 'next' | 'prev') => {
            const items = Array.from(menu.querySelectorAll<HTMLElement>(focusableSelector));
            if (!items.length) return;
            const activeEl = document.activeElement as HTMLElement | null;
            const currentIndex = activeEl ? items.indexOf(activeEl) : -1;
            let nextIndex = 0;

            if (direction === 'first') {
                nextIndex = 0;
            } else if (direction === 'last') {
                nextIndex = items.length - 1;
            } else if (direction === 'next') {
                nextIndex = currentIndex >= 0 ? (currentIndex + 1) % items.length : 0;
            } else {
                nextIndex = currentIndex >= 0 ? (currentIndex - 1 + items.length) % items.length : items.length - 1;
            }

            items[nextIndex]?.focus();
        };

        const setClosedStyles = (dropdown: HTMLElement, menu: HTMLElement) => {
            dropdown.classList.remove('is-open');
            menu.style.display = 'none';
            menu.style.visibility = 'hidden';
            menu.style.pointerEvents = 'none';
            menu.style.overflow = 'hidden';
            menu.style.height = '0px';
            setExpandedState(dropdown, menu, false);
        };

        const stopAnimation = (menu: HTMLElement) => {
            const frameId = animationFrames.get(menu);
            if (frameId === undefined) return;
            cancelAnimationFrame(frameId);
            animationFrames.delete(menu);
        };

        const animateHeight = (
            menu: HTMLElement,
            from: number,
            to: number,
            duration: number,
            onComplete: () => void,
        ) => {
            stopAnimation(menu);

            if (duration <= 1 || from === to) {
                menu.style.height = `${to}px`;
                onComplete();
                return;
            }

            const startTime = performance.now();
            const step = (now: number) => {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = easeSwing(progress);
                const current = from + (to - from) * eased;
                menu.style.height = `${current}px`;

                if (progress < 1) {
                    animationFrames.set(menu, requestAnimationFrame(step));
                    return;
                }

                animationFrames.delete(menu);
                onComplete();
            };

            animationFrames.set(menu, requestAnimationFrame(step));
        };

        const closeDropdown = (dropdown: HTMLElement, immediate = false) => {
            const menu = getMenu(dropdown);
            if (!menu) return;

            clearTimer(openTimers, dropdown);
            clearTimer(closeTimers, dropdown);
            stopAnimation(menu);

            const startHeight = menu.getBoundingClientRect().height || menu.scrollHeight;
            if (immediate || startHeight <= 0) {
                setClosedStyles(dropdown, menu);
                return;
            }

            menu.style.display = 'block';
            menu.style.visibility = 'visible';
            menu.style.pointerEvents = 'none';
            menu.style.overflow = 'hidden';
            menu.style.height = `${startHeight}px`;

            animateHeight(menu, startHeight, 0, slideDuration, () => {
                setClosedStyles(dropdown, menu);
            });
        };

        const openDropdown = (dropdown: HTMLElement) => {
            const menu = getMenu(dropdown);
            if (!menu) return;

            clearTimer(openTimers, dropdown);
            clearTimer(closeTimers, dropdown);
            stopAnimation(menu);

            dropdowns.forEach((otherDropdown) => {
                if (otherDropdown !== dropdown) {
                    closeDropdown(otherDropdown, true);
                }
            });

            dropdown.classList.add('is-open');
            menu.style.display = 'block';
            menu.style.visibility = 'visible';
            menu.style.pointerEvents = 'auto';
            menu.style.overflow = 'hidden';
            setExpandedState(dropdown, menu, true);

            const startHeight = menu.getBoundingClientRect().height;
            const targetHeight = menu.scrollHeight;

            if (targetHeight <= 0) {
                menu.style.height = 'auto';
                menu.style.overflow = '';
                return;
            }

            menu.style.height = `${startHeight > 0 ? startHeight : 0}px`;
            animateHeight(menu, startHeight > 0 ? startHeight : 0, targetHeight, slideDuration, () => {
                menu.style.height = 'auto';
                menu.style.overflow = '';
            });
        };

        const scheduleOpen = (dropdown: HTMLElement) => {
            clearTimer(closeTimers, dropdown);
            clearTimer(openTimers, dropdown);
            const timerId = window.setTimeout(() => {
                openDropdown(dropdown);
            }, openDelay);
            openTimers.set(dropdown, timerId);
        };

        const scheduleClose = (dropdown: HTMLElement) => {
            clearTimer(openTimers, dropdown);
            clearTimer(closeTimers, dropdown);
            const timerId = window.setTimeout(() => {
                closeDropdown(dropdown);
            }, closeDelay);
            closeTimers.set(dropdown, timerId);
        };

        dropdowns.forEach((dropdown) => {
            const menu = getMenu(dropdown);
            if (menu) {
                menu.setAttribute('role', 'menu');
                if (!menu.id) {
                    menu.id = `nav-menu-${Math.random().toString(36).slice(2, 8)}`;
                }
                setMenuItemRoles(menu);
                setClosedStyles(dropdown, menu);
            }

            const onMouseEnter = () => scheduleOpen(dropdown);
            const onMouseLeave = () => {
                if (dropdown.dataset.submenuHover === 'true') return;
                scheduleClose(dropdown);
            };
            const onFocusIn = () => openDropdown(dropdown);
            const onFocusOut = (event: FocusEvent) => {
                const nextTarget = event.relatedTarget as Node | null;
                if (nextTarget && dropdown.contains(nextTarget)) return;
                scheduleClose(dropdown);
            };
            const onTriggerKeyDown = (event: KeyboardEvent) => {
                const trigger = event.currentTarget as HTMLElement;
                const key = event.key;
                if (!menu) return;
                if (key === 'ArrowDown' || key === 'Enter' || key === ' ') {
                    event.preventDefault();
                    openDropdown(dropdown);
                    focusMenuItem(menu, 'first');
                } else if (key === 'ArrowUp') {
                    event.preventDefault();
                    openDropdown(dropdown);
                    focusMenuItem(menu, 'last');
                } else if (key === 'Escape') {
                    event.preventDefault();
                    closeDropdown(dropdown, true);
                    trigger.focus();
                }
            };
            const onMenuKeyDown = (event: KeyboardEvent) => {
                if (!menu) return;
                const key = event.key;
                if (key === 'Escape') {
                    event.preventDefault();
                    closeDropdown(dropdown, true);
                    getTrigger(dropdown)?.focus();
                    return;
                }
                if (key === 'ArrowDown') {
                    event.preventDefault();
                    focusMenuItem(menu, 'next');
                } else if (key === 'ArrowUp') {
                    event.preventDefault();
                    focusMenuItem(menu, 'prev');
                } else if (key === 'Home') {
                    event.preventDefault();
                    focusMenuItem(menu, 'first');
                } else if (key === 'End') {
                    event.preventDefault();
                    focusMenuItem(menu, 'last');
                }
            };

            dropdown.addEventListener('mouseenter', onMouseEnter);
            dropdown.addEventListener('mouseleave', onMouseLeave);
            dropdown.addEventListener('focusin', onFocusIn);
            dropdown.addEventListener('focusout', onFocusOut);
            const trigger = getTrigger(dropdown);
            if (trigger) {
                trigger.addEventListener('keydown', onTriggerKeyDown);
                if (menu?.id) {
                    trigger.setAttribute('aria-controls', menu.id);
                }
                trigger.setAttribute('aria-haspopup', 'menu');
                trigger.setAttribute('aria-expanded', 'false');
            }
            if (menu) {
                menu.addEventListener('keydown', onMenuKeyDown);
                menu.setAttribute('aria-hidden', 'true');
            }

            handlers.set(dropdown, { onMouseEnter, onMouseLeave, onFocusIn, onFocusOut, onTriggerKeyDown, onMenuKeyDown });

            const submenuMenus = Array.from(dropdown.querySelectorAll<HTMLElement>('.nav-submenu-menu'));
            if (submenuMenus.length) {
                const submenuTriggers = Array.from(dropdown.querySelectorAll<HTMLElement>('.nav-submenu-trigger'));
                submenuMenus.forEach((submenuMenu, index) => {
                    submenuMenu.setAttribute('role', 'menu');
                    if (!submenuMenu.id) {
                        submenuMenu.id = `nav-submenu-${Math.random().toString(36).slice(2, 8)}-${index}`;
                    }
                    submenuMenu.setAttribute('aria-hidden', 'true');
                    setMenuItemRoles(submenuMenu);
                    const submenuTrigger = submenuTriggers[index];
                    if (submenuTrigger) {
                        submenuTrigger.setAttribute('aria-haspopup', 'menu');
                        submenuTrigger.setAttribute('aria-expanded', 'false');
                        submenuTrigger.setAttribute('aria-controls', submenuMenu.id);
                    }
                });

                const onSubmenuEnter = () => {
                    dropdown.dataset.submenuHover = 'true';
                    clearTimer(closeTimers, dropdown);
                    openDropdown(dropdown);
                    submenuMenus.forEach((submenuMenu, idx) => {
                        const triggerEl = submenuTriggers[idx];
                        if (!triggerEl) return;
                        if (submenuMenu.matches(':hover') || triggerEl.matches(':hover') || triggerEl.matches(':focus-within')) {
                            triggerEl.setAttribute('aria-expanded', 'true');
                            submenuMenu.setAttribute('aria-hidden', 'false');
                        }
                    });
                };
                const onSubmenuLeave = () => {
                    dropdown.dataset.submenuHover = 'false';
                    if (dropdown.matches(':hover')) return;
                    scheduleClose(dropdown);
                    submenuMenus.forEach((submenuMenu, idx) => {
                        const triggerEl = submenuTriggers[idx];
                        if (!triggerEl) return;
                        triggerEl.setAttribute('aria-expanded', 'false');
                        submenuMenu.setAttribute('aria-hidden', 'true');
                    });
                };

                submenuMenus.forEach((menu) => {
                    menu.addEventListener('mouseenter', onSubmenuEnter);
                    menu.addEventListener('mouseleave', onSubmenuLeave);
                });
                const onTriggerFocus = (event: FocusEvent) => {
                    const triggerEl = event.currentTarget as HTMLElement;
                    const index = submenuTriggers.indexOf(triggerEl);
                    const submenuMenu = submenuMenus[index];
                    if (!submenuMenu) return;
                    triggerEl.setAttribute('aria-expanded', 'true');
                    submenuMenu.setAttribute('aria-hidden', 'false');
                };
                const onTriggerBlur = (event: FocusEvent) => {
                    const triggerEl = event.currentTarget as HTMLElement;
                    const index = submenuTriggers.indexOf(triggerEl);
                    const submenuMenu = submenuMenus[index];
                    const nextTarget = event.relatedTarget as Node | null;
                    if (submenuMenu && nextTarget && submenuMenu.contains(nextTarget)) return;
                    triggerEl.setAttribute('aria-expanded', 'false');
                    submenuMenu?.setAttribute('aria-hidden', 'true');
                };
                const onTriggerKeyDown = (event: KeyboardEvent) => {
                    const triggerEl = event.currentTarget as HTMLElement;
                    const index = submenuTriggers.indexOf(triggerEl);
                    const submenuMenu = submenuMenus[index];
                    if (!submenuMenu) return;
                    const key = event.key;
                    if (key === 'ArrowDown' || key === 'Enter' || key === ' ') {
                        event.preventDefault();
                        triggerEl.setAttribute('aria-expanded', 'true');
                        submenuMenu.setAttribute('aria-hidden', 'false');
                        focusMenuItem(submenuMenu, 'first');
                    } else if (key === 'ArrowUp') {
                        event.preventDefault();
                        triggerEl.setAttribute('aria-expanded', 'true');
                        submenuMenu.setAttribute('aria-hidden', 'false');
                        focusMenuItem(submenuMenu, 'last');
                    } else if (key === 'Escape') {
                        event.preventDefault();
                        triggerEl.setAttribute('aria-expanded', 'false');
                        submenuMenu.setAttribute('aria-hidden', 'true');
                        triggerEl.focus();
                    }
                };

                submenuTriggers.forEach((submenuTrigger) => {
                    submenuTrigger.addEventListener('focus', onTriggerFocus);
                    submenuTrigger.addEventListener('blur', onTriggerBlur);
                    submenuTrigger.addEventListener('keydown', onTriggerKeyDown);
                });

                submenuHandlers.set(dropdown, { menus: submenuMenus, triggers: submenuTriggers, onEnter: onSubmenuEnter, onLeave: onSubmenuLeave, onTriggerFocus, onTriggerBlur, onTriggerKeyDown });
            }
        });

        return () => {
            dropdowns.forEach((dropdown) => {
                clearTimer(openTimers, dropdown);
                clearTimer(closeTimers, dropdown);
                const menu = getMenu(dropdown);
                if (menu) {
                    stopAnimation(menu);
                    setClosedStyles(dropdown, menu);
                }

                const dropdownHandlers = handlers.get(dropdown);
                if (!dropdownHandlers) return;
                dropdown.removeEventListener('mouseenter', dropdownHandlers.onMouseEnter);
                dropdown.removeEventListener('mouseleave', dropdownHandlers.onMouseLeave);
                dropdown.removeEventListener('focusin', dropdownHandlers.onFocusIn);
                dropdown.removeEventListener('focusout', dropdownHandlers.onFocusOut);
                const trigger = getTrigger(dropdown);
                if (trigger) {
                    trigger.removeEventListener('keydown', dropdownHandlers.onTriggerKeyDown);
                }
                if (menu) {
                    menu.removeEventListener('keydown', dropdownHandlers.onMenuKeyDown);
                }

                const submenuHandler = submenuHandlers.get(dropdown);
                if (submenuHandler) {
                    submenuHandler.menus.forEach((menu) => {
                        menu.removeEventListener('mouseenter', submenuHandler.onEnter);
                        menu.removeEventListener('mouseleave', submenuHandler.onLeave);
                    });
                    submenuHandler.triggers.forEach((triggerEl) => {
                        triggerEl.removeEventListener('focus', submenuHandler.onTriggerFocus);
                        triggerEl.removeEventListener('blur', submenuHandler.onTriggerBlur);
                        triggerEl.removeEventListener('keydown', submenuHandler.onTriggerKeyDown);
                    });
                }
            });
        };
    }, []);

    return (
        <header id="site-header" className="relative z-[80] w-full bg-white">
            <div id="site-topbar" className="hidden border-b border-[#d7b05a]/35 bg-[#0a3555] text-white lg:block">
                <div className="mx-auto flex max-w-[1600px] items-center justify-between px-8 py-2 text-sm">
                    <div className="flex items-center gap-6">
                        <a href="mailto:media-water@ascww.com.eg" className="topbar-link">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#d7b05a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z" /><path d="m22 6-10 7L2 6" /></svg>
                            <span className="text-xs font-normal">media-water@ascww.com.eg</span>
                        </a>
                        <a href="tel:088-2331604" className="topbar-link">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#d7b05a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.1 9.91a16 16 0 0 0 6 6l1.27-1.26a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                            <span className="text-xs font-normal"> رقم الهاتف : 2331604-088</span>
                        </a>
                    </div>
                    <div className="flex items-center gap-3">
                        <a href="https://api.whatsapp.com/send?phone=201281565653" target="_blank" rel="noopener noreferrer" aria-label="واتساب" className="top-social">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.05 4.94A9.94 9.94 0 0 0 12 2a10 10 0 0 0-8.66 15l-1.3 4.74 4.86-1.27A10 10 0 1 0 19.05 4.94ZM12 20a8 8 0 0 1-4.07-1.11l-.29-.17-2.89.76.77-2.82-.18-.29A8 8 0 1 1 12 20Zm4.38-5.51c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12s-.62.78-.76.94c-.14.16-.28.18-.52.06a6.54 6.54 0 0 1-1.92-1.18 7.33 7.33 0 0 1-1.35-1.68c-.14-.24 0-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.79-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.12 3.65.58.25 1.03.4 1.38.52.58.18 1.1.16 1.51.1.46-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" /></svg>
                        </a>
                        <a href="https://youtube.com/channel/UC73LZeR5Yr5TE7fsTzvZSVw" target="_blank" rel="noopener noreferrer" aria-label="يوتيوب" className="top-social">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M21.58 7.19a2.75 2.75 0 0 0-1.94-1.94C17.93 4.8 12 4.8 12 4.8s-5.93 0-7.64.45A2.75 2.75 0 0 0 2.42 7.2 28.4 28.4 0 0 0 2 12a28.4 28.4 0 0 0 .42 4.81 2.75 2.75 0 0 0 1.94 1.94c1.7.45 7.64.45 7.64.45s5.93 0 7.64-.45a2.75 2.75 0 0 0 1.94-1.94A28.4 28.4 0 0 0 22 12a28.4 28.4 0 0 0-.42-4.81ZM10 15.5v-7l6 3.5-6 3.5Z" /></svg>
                        </a>
                        <a href="https://www.facebook.com/ASCWWeg" target="_blank" rel="noopener noreferrer" aria-label="فيسبوك" className="top-social">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3c-3.3 0-6 2.7-6 6v2H6v4h2v6h4v-6h3l1-4h-4v-2c0-1.1.9-2 2-2Z" /></svg>
                        </a>
                        <span className="text-xs font-bold text-[#d7b05a]">العربية</span>
                    </div>
                </div>
            </div>

            <div id="site-mainbar" className="site-mainbar border-b border-[#d7b05a]/35 bg-white duration-300">
                <div className="mx-auto grid w-full max-w-[1600px] grid-cols-[auto_auto] justify-start items-center gap-2 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-8 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:justify-normal xl:gap-5">
                    <Link to={ROUTES.home} className="order-2 flex items-center justify-self-start gap-3 xl:order-1 xl:justify-self-end">
                        <img
                            src="/images/egypt.svg"
                            alt="شعار الجمهورية"
                            width={120}
                            height={80}
                            className="h-10 w-auto sm:h-8 lg:h-10"
                            loading="eager"
                            decoding="async"
                            fetchPriority="high"
                        />
                        <img
                            src="/images/ascww-logo.png"
                            alt="شعار الشركة"
                            width={250}
                            height={205}
                            className="h-10 w-auto sm:h-8 lg:h-10"
                            loading="eager"
                            decoding="async"
                            fetchPriority="high"
                        />
                    </Link>

                    <nav ref={desktopMenuRef} aria-label="القائمة الرئيسية" className="main-menu-wrap order-3 hidden min-w-0 items-center justify-center gap-0.5 text-sm font-bold text-slate-800 xl:order-2 xl:flex">
                        <Link className="nav-link-classic nav-link-classic--active" to={ROUTES.home}>الرئيسية</Link>

                        <div className="nav-dropdown group">
                            <button
                                type="button"
                                className="nav-dropdown-trigger"
                                aria-haspopup="true"
                                aria-label="قائمة عن الشركة"
                            >
                                عن الشركة
                            </button>
                            <div className="nav-dropdown-menu nav-dropdown-menu--submenu">
                                <Link className="nav-dropdown-item" to={ROUTES.aboutCompany}>نبذه عن الشركة</Link>
                                <a className="nav-dropdown-item" href={ROUTES.branches}>فروع الشركه</a>
                                <a className="nav-dropdown-item" href={ROUTES.projectsArchive}>مشروعات الشركة</a>
                                <Link className="nav-dropdown-item" to={ROUTES.newsArchive}>أرشيف الأخبار</Link>
                                <div className="nav-submenu">
                                    <button type="button" className="nav-submenu-trigger">
                                        جودة المياه
                                        <span className="nav-submenu-caret" aria-hidden="true">◀</span>
                                    </button>
                                    <div className="nav-submenu-menu" role="menu">
                                        <a className="nav-dropdown-item" href={ROUTES.waterQuality}>جودة المياه</a>
                                        <a className="nav-dropdown-item" href={ROUTES.refiningWater}>تنقية مياه الشرب</a>
                                        <a className="nav-dropdown-item" href={ROUTES.labOfCompanyWater}>المعمل المركزي لمياه الشرب</a>
                                    </div>
                                </div>
                                <div className="nav-submenu">
                                    <button type="button" className="nav-submenu-trigger">
                                        الصرف الصحي
                                        <span className="nav-submenu-caret" aria-hidden="true">◀</span>
                                    </button>
                                    <div className="nav-submenu-menu" role="menu">
                                        <Link className="nav-dropdown-item" to={ROUTES.sewageTreatment}>معالجه الصرف الصحي</Link>
                                        <a className="nav-dropdown-item" href={ROUTES.safeSewageDisposal}>أهمية التخلص الآمن من الصرف الصحى ومعالجته</a>
                                        <a className="nav-dropdown-item" href={ROUTES.saveSewageNetwork}>أهميه الحفاظ علي شبكه الصرف الصحي</a>
                                        <a className="nav-dropdown-item" href={ROUTES.industrialWaste}>الصرف الصناعي</a>
                                        <a className="nav-dropdown-item" href={ROUTES.industrialWasteRole}>دور إداره الصرف الصناعي</a>
                                    </div>
                                </div>
                                <Link className="nav-dropdown-item" to={ROUTES.visionAndMessage}>الرؤيه والرساله</Link>
                                <a className="nav-dropdown-item" href={ROUTES.informationTechnologyOfCompany}>قطاع تكنولوجيا المعلومات</a>
                                <Link className="nav-dropdown-item" to={ROUTES.organizationStructure}>الهيكل التنظيمي</Link>
                                <Link className="nav-dropdown-item" to={ROUTES.companyAchievements}>إنجازات الشركة</Link>
                                <a className="nav-dropdown-item" href={ROUTES.contractsRegulation}>اللائحه الموحده للعقود والمشتريات</a>
                            </div>
                        </div>

                        <div className="nav-dropdown group">
                            <button
                                type="button"
                                className="nav-dropdown-trigger"
                                aria-haspopup="true"
                                aria-label="قائمة التوعية والاتصال"
                            >
                                التوعية والاتصال
                            </button>
                            <div className="nav-dropdown-menu">
                                <a className="nav-dropdown-item" href={ROUTES.adviceAndContact}>التوعية والأتصال</a>
                                <Link className="nav-dropdown-item" to={ROUTES.cyberSecurityGuidelines}>ارشادات الامن السيبرانى</Link>
                                <a className="nav-dropdown-item" href={ROUTES.forKidsAndWomen}>ركن الأطفال ولكِ سيدتي</a>
                            </div>
                        </div>

                        <Link className="nav-link-classic" to={ROUTES.tendersArchive}>المناقصات</Link>

                        <div className="nav-dropdown group">
                            <button
                                type="button"
                                className="nav-dropdown-trigger"
                                aria-label="قائمة التدريب"
                            >
                                التدريب
                            </button>
                            <div className="nav-dropdown-menu">
                                <a className="nav-dropdown-item" href={ROUTES.generalAdminTraining}>أنواع التدريب والقاعات</a>
                                <a className="nav-dropdown-item" href={ROUTES.schoolSubmissionData}>نتائج المدرسه</a>
                            </div>
                        </div>

                        <div className="nav-dropdown group">
                            <button
                                type="button"
                                className="nav-dropdown-trigger"
                                aria-label="قائمة الوظائف"
                            >
                                وظائف
                            </button>
                            <div className="nav-dropdown-menu">
                                <a className="nav-dropdown-item" href={ROUTES.jobsAndCompetition}>مسابقات و وظائف</a>
                                <a className="nav-dropdown-item" href={ROUTES.resultOfWorker}>نتائج المسابقات</a>
                            </div>
                        </div>

                        <div className="nav-dropdown group">
                            <button
                                type="button"
                                className="nav-dropdown-trigger"
                                aria-label="قائمة الخدمات"
                            >
                                خدمات
                            </button>
                            <div className="nav-dropdown-menu">
                                <a className="nav-dropdown-item" href="http://bills.ascww.com.eg/Inqeury.aspx" target="_blank" rel="noopener noreferrer">استعلم عن فاتورتك</a>
                                <a className="nav-dropdown-item" href={ROUTES.callCenter}>خدمه العملاء</a>
                                <a className="nav-dropdown-item" href={ROUTES.hotlineApp}>الخط الساخن</a>
                                <Link className="nav-dropdown-item" to={ROUTES.search}>ابحث فى اخبار الشركة وخدماتها</Link>
                                <a className="nav-dropdown-item" href={ROUTES.myReadingApp}>تطبيق قراءتي</a>
                                <a className="nav-dropdown-item" href={ROUTES.customerCharter}>ميثاق المتعاملين</a>
                                <Link className="nav-dropdown-item" to={ROUTES.servicesEvidance}>دليل المستخدمين</Link>
                                <Link className="nav-dropdown-item" to={ROUTES.contractOnService}>رحلة المتعامل للتعاقد على طلب خدمة</Link>
                                <a className="nav-dropdown-item" href={ROUTES.provideRequest}>الأسئلة الشائعة</a>
                                <a className="nav-dropdown-item" href={ROUTES.provideComplaine}>تقديم شكوي</a>
                            </div>
                        </div>

                        <div className="nav-dropdown group">
                            <button
                                type="button"
                                className="nav-dropdown-trigger"
                                aria-label="قائمة دعم النزاهة"
                            >
                                دعم النزاهة
                            </button>
                            <div className="nav-dropdown-menu">
                                <a className="nav-dropdown-item" href={ROUTES.integritySupportOverview}>نبذه عن إداره دعم النزاهة</a>
                                <a className="nav-dropdown-item" href={ROUTES.integritySupportHighlights}>أبرز أعمال دعم النزاهة</a>
                                <a className="nav-dropdown-item" href={ROUTES.professionalConduct}>السلوك الوظيفي</a>
                            </div>
                        </div>

                        <div className="nav-dropdown group">
                            <button
                                type="button"
                                className="nav-dropdown-trigger"
                                aria-label="قائمة معرض الصور"
                            >
                                معرض الصور
                            </button>
                            <div className="nav-dropdown-menu">
                                <a className="nav-dropdown-item" href={ROUTES.bossTrips}>جولات رئيس مجلس الإداره</a>
                                <a className="nav-dropdown-item" href={ROUTES.labOfCompany}>معامل الشركه</a>
                                <a className="nav-dropdown-item" href={ROUTES.wasteOfCompany}>محطات الصرف</a>
                                <a className="nav-dropdown-item" href={ROUTES.trainingOfCompany}>مركز التدريب</a>
                                <a className="nav-dropdown-item" href={ROUTES.schoolGallery}>المدرسه الفنيه</a>
                                <a className="nav-dropdown-item" href={ROUTES.sportOfCompany}>النشاط الرياضي</a>
                            </div>
                        </div>
                    </nav>

                    <div className="order-1 flex items-center justify-self-start gap-3 xl:order-3 xl:justify-self-start">
                        <form
                            ref={searchFormRef}
                            className="group relative hidden xl:flex xl:w-80 2xl:w-[26rem]"
                            role="search"
                            aria-label="بحث في الموقع"
                            onSubmit={(event) => {
                                event.preventDefault();
                                const trimmed = searchTerm.trim();
                                if (trimmed.length < 2) return;
                                setIsSearchOpen(false);
                                navigate(`${ROUTES.search}?q=${encodeURIComponent(trimmed)}`);
                            }}
                        >
                            <div className="relative flex w-full items-center rounded-full border border-[#d7b05a]/50 bg-white px-3 py-1.5 transition-colors hover:border-[#0a3555]/60">
                                <span className="pointer-events-none ml-1 flex items-center text-[#0a3555]/70">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <path d="m21 21-4.35-4.35"></path>
                                    </svg>
                                </span>
                                <input
                                    type="search"
                                    name="q"
                                    placeholder="ابحث في أخبار الشركة وخدماتها..."
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    onFocus={() => {
                                        if (searchTerm.trim().length >= 2) {
                                            setIsSearchOpen(true);
                                        }
                                    }}
                                    className="h-9 w-full bg-transparent px-2 text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="mr-1 inline-flex h-8 items-center justify-center rounded-full bg-[#0a3555] px-3 text-xs font-semibold text-white transition hover:bg-[#082b47]"
                                >
                                    بحث
                                </button>
                            </div>
                            {isSearchOpen && hasSearchFeedback ? (
                                <div className="absolute top-full right-0 z-50 mt-3 w-full overflow-hidden rounded-2xl border border-[#d7b05a]/35 bg-white">
                                    <div className="border-b border-[#d7b05a]/25 bg-[#0a3555]/5 px-4 py-2 text-xs font-semibold text-[#0a3555]">
                                        نتائج البحث
                                    </div>
                                    <div className="max-h-72 overflow-y-auto py-2 text-sm text-slate-700">
                                        {isSearching ? (
                                            <div className="px-4 py-3 text-slate-500">جاري البحث...</div>
                                        ) : searchError ? (
                                            <div className="px-4 py-3 text-red-600">{searchError}</div>
                                        ) : hasResults ? (
                                            <>
                                                {displayResults.map((item) => {
                                                    const isExternal = item.url ? /^https?:\/\//i.test(item.url) : false;
                                                    const metaText = [item.typeLabel, item.dateLabel].filter(Boolean).join(' - ');

                                                    if (!item.url) {
                                                        return (
                                                            <div key={item.key} className="px-4 py-2">
                                                                <div className="font-semibold text-slate-900">{item.title}</div>
                                                                {metaText ? (
                                                                    <div className="mt-0.5 text-[11px] font-medium text-[#0a3555]/75">
                                                                        {metaText}
                                                                    </div>
                                                                ) : null}
                                                                {item.description ? (
                                                                    <div className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                                                                        {item.description}
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        );
                                                    }

                                                    return (
                                                        <a
                                                            key={item.key}
                                                            href={item.url}
                                                            className="block px-4 py-2 transition-colors hover:bg-[#0a3555]/5"
                                                            target={isExternal ? '_blank' : undefined}
                                                            rel={isExternal ? 'noopener noreferrer' : undefined}
                                                        >
                                                            <div className="font-semibold text-slate-900">{item.title}</div>
                                                            {metaText ? (
                                                                <div className="mt-0.5 text-[11px] font-medium text-[#0a3555]/75">
                                                                    {metaText}
                                                                </div>
                                                            ) : null}
                                                            {item.description ? (
                                                                <div className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                                                                    {item.description}
                                                                </div>
                                                            ) : null}
                                                        </a>
                                                    );
                                                })}
                                                <button
                                                    type="button"
                                                    className="mt-2 w-full border-t border-[#d7b05a]/25 px-4 py-2 text-right text-xs font-semibold text-[#0a3555] transition hover:bg-[#0a3555]/5"
                                                    onClick={() => {
                                                        const trimmed = searchTerm.trim();
                                                        if (trimmed.length < 2) return;
                                                        setIsSearchOpen(false);
                                                        navigate(`${ROUTES.search}?q=${encodeURIComponent(trimmed)}`);
                                                    }}
                                                >
                                                    عرض كل النتائج
                                                </button>
                                            </>
                                        ) : (
                                            <div className="px-4 py-3 text-slate-500">لا توجد نتائج مطابقة.</div>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </form>
                        <button
                            id="mobile-toggle"
                            ref={toggleRef}
                            type="button"
                            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                            className="relative z-[90] inline-flex touch-manipulation rounded-lg border border-slate-300 p-1.5 text-slate-700 xl:hidden sm:p-2"
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-menu"
                            aria-label={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div id="mainbar-offset" className="h-0"></div>

            <nav
                id="mobile-menu"
                ref={menuRef}
                aria-hidden={!isMobileMenuOpen}
                onClickCapture={(event) => {
                    const target = event.target as HTMLElement | null;
                    if (target?.closest('a')) {
                        setIsMobileMenuOpen(false);
                    }
                }}
                className={`fixed inset-x-0 top-[4.75rem] z-[85] max-h-[calc(100vh-4.75rem)] overflow-y-auto border-b border-[#d7b05a]/35 bg-white px-4 py-3 text-base font-semibold text-slate-800 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] xl:hidden ${isMobileMenuOpen
                    ? 'visible translate-y-0 opacity-100 pointer-events-auto'
                    : 'invisible -translate-y-3 opacity-0 pointer-events-none'
                    }`}
            >
                <div className="grid grid-cols-1 gap-2">
                    <Link className="rounded-lg bg-slate-100 px-3 py-2" to={ROUTES.home}>الرئيسية</Link>
                    <details className="mobile-nav-group"><summary>عن الشركة</summary><div className="mobile-nav-submenu"><Link to={ROUTES.aboutCompany}>عن الشركة</Link><a href={ROUTES.branches}>فروع الشركه</a><a href={ROUTES.projectsArchive}>مشروعات الشركة</a><Link to={ROUTES.newsArchive}>أرشيف الأخبار</Link><div className="mobile-nav-subtitle">جودة المياه</div><a href={ROUTES.waterQuality}>جودة المياه</a><a href={ROUTES.refiningWater}>تنقية مياه الشرب</a><a href={ROUTES.labOfCompanyWater}>المعمل المركزي لمياه الشرب</a><div className="mobile-nav-subtitle">الصرف الصحي</div><Link to={ROUTES.sewageTreatment}>معالجه الصرف الصحي</Link><a href={ROUTES.safeSewageDisposal}>أهمية التخلص الآمن من الصرف الصحى ومعالجته</a><a href={ROUTES.saveSewageNetwork}>أهميه الحفاظ علي شبكه الصرف الصحي</a><a href={ROUTES.industrialWaste}>الصرف الصناعي</a><a href={ROUTES.industrialWasteRole}>دور إداره الصرف الصناعي</a><Link to={ROUTES.visionAndMessage}>الرؤيه والرساله</Link><a href={ROUTES.informationTechnologyOfCompany}>قطاع تكنولوجيا المعلومات</a><Link to={ROUTES.organizationStructure}>الهيكل التنظيمي</Link><Link to={ROUTES.companyAchievements}>إنجازات الشركة</Link><a href={ROUTES.contractsRegulation}>اللائحه الموحده للعقود والمشتريات</a></div></details>
                    <details className="mobile-nav-group"><summary>التوعية والاتصال</summary><div className="mobile-nav-submenu"><a href={ROUTES.adviceAndContact}>التوعية والأتصال</a><Link to={ROUTES.cyberSecurityGuidelines}>ارشادات الامن السيبرانى</Link><a href={ROUTES.forKidsAndWomen}>ركن الأطفال ولكِ سيدتي</a></div></details>
                    <Link className="rounded-lg bg-slate-100 px-3 py-2" to={ROUTES.tendersArchive}>المناقصات</Link>
                    <details className="mobile-nav-group"><summary>التدريب</summary><div className="mobile-nav-submenu"><a href={ROUTES.generalAdminTraining}>أنواع التدريب والقاعات</a><a href={ROUTES.schoolSubmissionData}>نتائج المدرسه</a></div></details>
                    <details className="mobile-nav-group"><summary>وظائف</summary><div className="mobile-nav-submenu"><a href={ROUTES.jobsAndCompetition}>مسابقات و وظائف</a><a href={ROUTES.resultOfWorker}>نتائج المسابقات</a></div></details>
                    <details className="mobile-nav-group"><summary>خدمات</summary><div className="mobile-nav-submenu"><a href="http://bills.ascww.com.eg/Inqeury.aspx" target="_blank" rel="noopener noreferrer">استعلم عن فاتورتك</a><a href={ROUTES.callCenter}>خدمه العملاء</a><a href={ROUTES.hotlineApp}>الخط الساخن</a><Link to={ROUTES.search}>ابحث فى اخبار الشركة وخدماتها</Link><a href={ROUTES.myReadingApp}>تطبيق قراءتي</a><a href={ROUTES.customerCharter}>ميثاق المتعاملين</a><Link to={ROUTES.servicesEvidance}>دليل المستخدمين</Link><Link to={ROUTES.contractOnService}>رحلة المتعامل للتعاقد على طلب خدمة</Link><a href={ROUTES.provideRequest}>الأسئلة الشائعة</a><a href={ROUTES.provideComplaine}>تقديم شكوي</a></div></details>
                    <details className="mobile-nav-group"><summary>دعم النزاهة</summary><div className="mobile-nav-submenu"><a href={ROUTES.integritySupportOverview}>نبذه عن إداره دعم النزاهة</a><a href={ROUTES.integritySupportHighlights}>أبرز أعمال دعم النزاهة</a><a href={ROUTES.professionalConduct}>السلوك الوظيفي</a></div></details>
                    <details className="mobile-nav-group"><summary>معرض الصور</summary><div className="mobile-nav-submenu"><a href={ROUTES.bossTrips}>جولات رئيس مجلس الإداره</a><a href={ROUTES.labOfCompany}>معامل الشركه</a><a href={ROUTES.wasteOfCompany}>محطات الصرف</a><a href={ROUTES.trainingOfCompany}>مركز التدريب</a><a href={ROUTES.schoolGallery}>المدرسه الفنيه</a><a href={ROUTES.sportOfCompany}>النشاط الرياضي</a></div></details>
                    <a className="rounded-lg bg-[#0a3555] px-3 py-2 text-center text-white" href="tel:088-2331604"> الخط الساخن :   2331604-088</a>
                    <div className="col-span-1 mt-1 flex flex-wrap items-center justify-center gap-3 rounded-lg bg-slate-100 px-3 py-3">
                        <a href="https://www.facebook.com/ASCWWeg" target="_blank" rel="noopener noreferrer" aria-label="فيسبوك" className="social-icon social-icon--facebook"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a6 6 0 0 0-6 6v4H7v4h2v6h4v-6h3l1-4h-4V8a2 2 0 0 1 2-2h1z" /></svg></a>
                        <a href="https://api.whatsapp.com/send?phone=201281565653" target="_blank" rel="noopener noreferrer" aria-label="واتساب" className="social-icon social-icon--whatsapp"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg></a>
                        <a href="https://youtube.com/channel/UC73LZeR5Yr5TE7fsTzvZSVw" target="_blank" rel="noopener noreferrer" aria-label="يوتيوب" className="social-icon social-icon--youtube"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.96-2C18.88 4 12 4 12 4s-6.88 0-8.58.46a2.78 2.78 0 0 0-1.96 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.42 19c1.7.46 8.58.46 8.58.46s6.88 0 8.58-.46a2.78 2.78 0 0 0 1.96-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg></a>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default memo(Header);



