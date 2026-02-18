import { Component, inject } from '@angular/core';
import { InputFieldComponent } from './../../form/input/input-field.component';
import { ModalService } from '../../../services/modal.service';
import { AuthService } from '../../../../core/services/auth.service';

import { ModalComponent } from '../../ui/modal/modal.component';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'app-user-meta-card',
  imports: [
    ModalComponent,
    InputFieldComponent,
    ButtonComponent
  ],
  templateUrl: './user-meta-card.component.html',
  styles: ``
})
export class UserMetaCardComponent {

  private authService = inject(AuthService);

  constructor(public modal: ModalService) {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.user = {
        ...this.user,
        firstName: currentUser.name.split(' ')[0] || '',
        lastName: currentUser.name.split(' ').slice(1).join(' ') || '',
        email: currentUser.email,
        role: currentUser.role
      };
    }
  }

  isOpen = false;
  openModal() { this.isOpen = true; }
  closeModal() { this.isOpen = false; }

  // Example user data (could be made dynamic)
  user = {
    firstName: 'Musharof',
    lastName: 'Chowdhury',
    role: 'Team Manager',
    location: 'Arizona, United States',
    avatar: '/images/user/owner.png',
    social: {
      facebook: 'https://www.facebook.com/PimjoHQ',
      x: 'https://x.com/PimjoHQ',
      linkedin: 'https://www.linkedin.com/company/pimjo',
      instagram: 'https://instagram.com/PimjoHQ',
    },
    email: 'randomuser@pimjo.com',
    phone: '+09 363 398 46',
    bio: 'Team Manager',
  };

  handleSave() {
    // Handle save logic here
    console.log('Saving changes...');
    this.modal.closeModal();
  }
}
