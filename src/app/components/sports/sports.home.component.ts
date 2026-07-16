import {Component, effect, ElementRef, EventEmitter, NgZone, OnDestroy, Output, signal, ViewChild} from "@angular/core";
import {RouterLink} from "@angular/router";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {SportModel} from "../../models/sport.model";
import {SportsService} from "../../services/sports.service";

@Component({
  selector: 'sports',
  templateUrl: './sports.home.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
    NgClass
  ]
})
export class SportsHomeComponent implements OnDestroy {
  @ViewChild('container') container!: ElementRef<HTMLElement>;
  @ViewChild('ghostWrapper') ghostWrapper!: ElementRef<HTMLElement>;
  @Output() selectedSportId: EventEmitter<number | undefined> = new EventEmitter<number | undefined>();

  private resizeObserver?: ResizeObserver;
  private itemWidths: number[] = [];
  private readonly gap = 10;
  private readonly toggleWidth = 200;

  allSports = signal<SportModel[]>([]);
  visibleSports = signal<SportModel[]>([]);
  hiddenSports = signal<SportModel[]>([]);
  isDropdownOpen = signal<boolean>(false);
  isLoading = signal<boolean>(true);

  constructor(private zone: NgZone, private sportsService: SportsService) {
    effect(() => {
      const sports = this.allSports();
      if (sports.length > 0)
        setTimeout(() => {
          this.calculateInitialWidths();
          this.initResizeObserver();
        }, 0);
    });
  }

  private getSports() {
    this.isLoading.set(true);

    this.sportsService.get().subscribe({
      next: data => {
        this.allSports.set(data || []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  private initResizeObserver() {
    if (this.resizeObserver) return;

    this.resizeObserver = new ResizeObserver(() => {
      this.zone.run(() => this.updateToolbar());
    });

    this.resizeObserver.observe(this.container.nativeElement);
  }

  private calculateInitialWidths() {
    if (!this.ghostWrapper) return;

    const children = this.ghostWrapper.nativeElement.children;

    this.itemWidths = Array.from(children).map(
      child => (child as HTMLElement).offsetWidth + this.gap
    );

    this.updateToolbar();
  }

  private updateToolbar() {
    const sports = this.allSports();
    if (sports.length === 0) return;

    const containerWidth = this.container.nativeElement.offsetWidth;
    let currentWidth = 0;

    const visible: SportModel[] = [];
    const hidden: SportModel[] = [];

    for (let i = 0; i < sports.length; i++) {
      currentWidth += this.itemWidths[i];

      if (currentWidth > containerWidth - this.toggleWidth) {
        hidden.push(...sports.slice(i));
        break;
      }

      visible.push(sports[i]);
    }

    if (visible.length === 0 && sports.length > 0) {
      visible.push(sports[0]);
      hidden.shift();
    }

    this.visibleSports.set(visible);
    this.hiddenSports.set(hidden);
  }

  toggleDropdown() {
    this.isDropdownOpen.update(v => !v);
  }

  closeDropdown() {
    this.isDropdownOpen.set(false);
  }

  selectSport(sport?: SportModel) {
    this.selectedSportId.emit(sport?.id);
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  ngOnInit() {
    this.selectedSportId.emit(undefined);
    this.getSports();
  }
}
