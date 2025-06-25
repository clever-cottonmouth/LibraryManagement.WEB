import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { LibraryService } from '../../shared/services/library.service';
import { LibrarySettings } from '../../shared/models/settings.model';
import { Student } from '../../shared/models/student.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  loading = false;
  student: Student | null = null;

  constructor(
    private fb: FormBuilder,
    private libraryService: LibraryService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.settingsForm = this.fb.group({
      maxBookLimit: [1, [Validators.required, Validators.min(1)]],
      penaltyPerDay: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadSettings();
    const studentId = this.route.snapshot.paramMap.get('studentId');
    if (studentId) {
      this.loadStudent(+studentId);
    }
  }

  loadSettings(): void {
    this.loading = true;
    this.libraryService.getSettings().subscribe({
      next: (settingsArray: LibrarySettings[]) => {
        const settings = settingsArray[0]; // Get the first (and only) settings object
        if (settings) {
          this.settingsForm.patchValue(settings);
        }
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load settings', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  loadStudent(id: number): void {
    this.libraryService.getStudent(id).subscribe({
      next: (student: Student) => {
        this.student = student;
      },
      error: () => {
        this.snackBar.open('Failed to load student details', 'Close', { duration: 3000 });
      }
    });
  }

  saveSettings(): void {
    if (this.settingsForm.invalid) return;
    this.loading = true;
    const settings: LibrarySettings = this.settingsForm.value;
    this.libraryService.updateSettings(settings).subscribe({
      next: () => {
        this.snackBar.open('Settings updated successfully', 'Close', { duration: 3000 });
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to update settings', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}
