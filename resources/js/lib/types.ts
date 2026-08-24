export interface PaginatorLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatorMeta {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
    links: PaginatorLink[];
    path: string;
}

export interface PaginatorLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

/** Shape returned by Laravel's ->paginate() via Inertia */
export interface Paginator<T> {
    data: T[];
    links: PaginatorLinks;
    meta: PaginatorMeta;
}
