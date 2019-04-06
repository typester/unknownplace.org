declare module "pagination" {
  //  interface PaginationStatic {
  //    TemplatePaginator: (options: TemplatePaginatorOptions) => void;
  //  }
  export const TemplatePaginator: (options: TemplatePaginatorOptions) => TemplatePaginator;

  interface TemplatePaginatorOptions {
    prelink: string;
    current: number;
    rowsPerPage: number;
    totalResult: number;
    slashSeparator?: boolean;
    template: (vars: TemplatePaginatorVariables) => React.Node;
  }

  interface TemplatePaginatorVariables {
    prelink: string;
    preparedPreLink: string;
    current: number;
    previous: number;
    next: number;
    first: number;
    last: number;
    range: number[];
    fromResult: number;
    toResult: number;
    totalResult: number;
    pageCount: number;
  }

  interface TemplatePaginator {
    render: () => React.Node;
  }
}
