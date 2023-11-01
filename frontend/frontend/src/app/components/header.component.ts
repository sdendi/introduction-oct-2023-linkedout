import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { CounterFeature } from "../state/counter";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-header",
  template: `
    <header>
      <p class="text-3xl font-mono">Linked Out</p>
      <span *ngIf="current() % 2 === 0">Even</span>
      <span *ngIf="current() % 2 !== 0">Odd</span>
      <p class="text-lg">Our Application</p>
    </header>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class HeaderComponent {
  current = this.store.selectSignal(CounterFeature.selectCurrent);
  constructor(private store: Store) {}
}
