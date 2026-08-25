export interface PaginatorLink {
    url: string | null;
    label: string;
    active: boolean;
}

/**
 * Shape returned by Laravel's ->paginate() when the paginator is passed
 * straight to Inertia::render() (see LengthAwarePaginator::toArray()).
 *
 * NOTE: this is a FLAT structure. The nested `{ data, meta, links }` form only
 * appears when the paginator is wrapped in an API ResourceCollection, which
 * this app does not do. Do not reintroduce `paginator.meta.*` here.
 */
export interface Paginator<T> {
    data: T[];
    current_page: number;
    first_page_url: string | null;
    from: number | null;
    last_page: number;
    last_page_url: string | null;
    links: PaginatorLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}
