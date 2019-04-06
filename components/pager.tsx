import React from 'react';
import { TemplatePaginatorVariables } from 'pagination';
import Link from 'next/link';

interface PagerProps {
  data: TemplatePaginatorVariables;
}

const link = ({ prelink }: TemplatePaginatorVariables, page: number) => {
  if (page == 1) {
    return prelink;
  }
  return `${prelink}/page/${page}`
};

export const Pager: React.StatelessComponent<PagerProps> = ({ data }) =>
  <nav className="pagination is-centered is-small" role="navigation">
    { data.previous ?
      <Link href={link(data, data.previous)}><a className="pagination-previous">Previous</a></Link>
      :
      <a className="pagination-previous" disabled>Previous</a>
    }
    { data.next ?
      <Link href={link(data, data.next)}><a className="pagination-next">Next</a></Link>
      :
      <a className="pagination-next" disabled>Next</a>
    }
    <ul className="pagination-list">
      { data.range.map(r =>
        <li key={r}>
          { r == data.current ?
            <a className="pagination-link is-current">{r}</a>
            :
            <Link href={link(data, r)}><a className="pagination-link">{r}</a></Link>
          }
        </li>
      )}
    </ul>
  </nav>;
