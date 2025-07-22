// ngc

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  resource,
  signal,
} from '@angular/core';
import { ApiLink } from '../types';

@Component({
  selector: 'app-links-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <p>List Goes Here</p>

    @if (linksResource.isLoading()) {
      <div class="loading-ball loading"></div>
    } @else {
      <form class="filter">
        <input
          (click)="filterTag.set(null)"
          class="btn btn-square"
          type="reset"
          value="×"
        />
        @for (tag of tags(); track tag) {
          @if (tag === filterTag() || !filterTag()) {
            <input
              (click)="filterTag.set(tag)"
              class="btn"
              type="radio"
              name="filter"
              [attr.aria-label]="tag"
            />
          }
        }
      </form>
      @if (linksResource.hasValue()) {
        <ul class="list rounded-box bg-base-300">
          @for (link of filteredLinks(); track link.id) {
            <li class="list-row mb-2">
              <div>
                <p class="text-md font-bold">{{ link.title }}</p>
                <a class="link" [href]="link.url" target="_blank">{{
                  link.url
                }}</a>
              </div>
              <div></div>
              <div>
                @for (tag of link.tags; track tag) {
                  <button
                    (click)="filterTag.set(tag)"
                    class="badge badge-primary mr-2"
                  >
                    {{ tag }}
                  </button>
                }
              </div>
            </li>
          } @empty {
            <p>Sorry, no links! Maybe add some?</p>
          }
        </ul>
      }
    }
  `,
  styles: ``,
})
export class List {
  filterTag = signal<string | null>(null);

  linksResource = resource<ApiLink[], unknown>({
    loader: () =>
      fetch('https://links-api.fictionalcompany.com/api/links').then((r) =>
        r.json(),
      ),
  });

  filteredLinks = computed(() => {
    const tag = this.filterTag();
    if (tag === null) return this.linksResource.value();
    return (this.linksResource.value() || []).filter((link) =>
      link.tags.includes(tag),
    );
  });

  tags = computed(() => {
    const links = this.linksResource.value() || [];
    const allTags = new Set<string>();
    links.forEach((link) => link.tags.forEach((tag) => allTags.add(tag)));
    return Array.from(allTags);
  });
}
