import { Directive, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appResizeTracker]',
  standalone: true
})
export class ResizeTrackerDirective implements OnInit, OnDestroy {
  @Output() isSmallScreen = new EventEmitter<boolean>();

  private resizeObserver!: ResizeObserver;
  private lastState: boolean | null = null;

  constructor(private el: ElementRef, private zone: NgZone) {}

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const width = entry.contentRect.width;
          const currentState = width < 938;

          if (currentState !== this.lastState) {
            this.lastState = currentState;

            this.zone.run(() => {
              this.isSmallScreen.emit(currentState);
            });
          }
        }
      });

      this.resizeObserver.observe(this.el.nativeElement);
    });
  }

  ngOnDestroy(): void {
    if (this.resizeObserver)
      this.resizeObserver.disconnect();
  }
}
