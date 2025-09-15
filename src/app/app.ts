import { Component, DoCheck, inject, signal } from '@angular/core';
import { NavigationError, Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatTooltipModule } from '@angular/material/tooltip';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  imports: [RouterModule, MatTooltipModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements DoCheck {
  private readonly titleService = inject(Title);

  private router = inject(Router);
  private lastFailedUrl = signal('');

  private navigationErrors = toSignal(
    this.router.events.pipe(
      filter(
        (event): event is NavigationError => event instanceof NavigationError
      ),
      map((event) => {
        this.lastFailedUrl.set(event.url);
        if (event.error) {
          console.error('Navigation error', event.error);
        }
        return 'Navigation failed. Please try again.';
      })
    ),
    { initialValue: '' }
  );

  errorMessage = this.navigationErrors;

  protected title = 'mec-frontend';

  ngDoCheck() {
    this.title = this.titleService.getTitle();
  }

  retryNavigation() {
    if (this.lastFailedUrl()) {
      this.router.navigateByUrl(this.lastFailedUrl());
    }
  }
}
