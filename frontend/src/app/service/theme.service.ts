import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'user-theme';
    isDarkMode = signal<boolean>(false);

    constructor() {
        this.loadTheme();
    }

    toggleTheme() {
        this.isDarkMode.update(dark => !dark);
        this.updateTheme();
    }

    setLightMode() {
        this.isDarkMode.set(false);
        this.updateTheme();
    }

    private loadTheme() {
        const savedTheme = localStorage.getItem(this.THEME_KEY);


        if (savedTheme === 'dark') {
            this.isDarkMode.set(true);
        } else {
            this.isDarkMode.set(false);
        }

        this.updateTheme();
    }

    private updateTheme() {
        const dark = this.isDarkMode();
        if (dark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem(this.THEME_KEY, 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem(this.THEME_KEY, 'light');
        }
    }
}
