export type AdminInfoResponse = {
    boss_title?: string;
    boss_name?: string;
    boss_speech?: string;
    boss_image?: string;
    has_boss_image?: boolean;
};

export type NewsImage = {
    id?: number;
    path?: string;
    main_image?: number;
};

export type NewsItem = {
    id?: number;
    title?: string;
    slug?: string;
    active?: number;
    description?: string;
    created_at?: string;
    updated_at?: string;
    news_images?: NewsImage[];
};

export type ProjectImage = {
    id?: number;
    path?: string;
    main_image?: number;
};

export type ProjectItem = {
    id?: number;
    title?: string;
    slug?: string;
    active?: number;
    description?: string;
    created_at?: string;
    updated_at?: string;
    project_images?: ProjectImage[];
};

export type TenderFile = {
    id?: number;
    tender_id?: number;
    type?: string;
    name?: string;
    path?: string;
    created_at?: string;
    updated_at?: string;
};

export type TenderItem = {
    id?: number;
    title?: string;
    slug?: string;
    type?: string;
    active?: number;
    home?: number;
    description?: string;
    expiration_date?: string;
    created_at?: string;
    updated_at?: string;
    tender_files?: TenderFile[];
};

export type CareerItem = {
    id?: number;
    slug?: string;
    title?: string;
    description?: string;
    type_id?: number;
    image_name?: string;
    image_path?: string;
    file_name?: string;
    file_path?: string;
    active?: number;
    home?: number;
    user_id?: number;
    edit_user_id?: number | null;
    created_at?: string;
    updated_at?: string;
};
