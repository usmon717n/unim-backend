import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountService {
  private profile = {
    id: '1',
    name: 'Aziz Karimov',
    phone: '+998 90 123-45-67',
    email: 'aziz@example.com',
    avatar: 'https://i.pravatar.cc/150?img=33',
    memberSince: '2023-01-15',
    status: 'active',
  };

  private avimedPass = {
    id: '1',
    cardNumber: '8829 4521 7890 1234',
    balance: 250000,
    status: 'active',
    validUntil: '2027-12-31',
    tier: 'Gold',
  };

  private documents = [
    {
      id: '1',
      title: 'Pasport',
      type: 'Hujjat',
      date: '2024-01-15',
      icon: 'FileText',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      id: '2',
      title: 'Tibbiy karta',
      type: 'Tibbiyot',
      date: '2024-03-20',
      icon: 'Heart',
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-500',
    },
    {
      id: '3',
      title: 'Haydovchilik guvohnomasi',
      type: 'Hujjat',
      date: '2023-11-05',
      icon: 'CreditCard',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-500',
    },
    {
      id: '4',
      title: "Sug'urta polisi",
      type: 'Moliya',
      date: '2024-06-01',
      icon: 'Shield',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
    },
    {
      id: '5',
      title: 'Diplom',
      type: "Ta'lim",
      date: '2020-07-15',
      icon: 'File',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-500',
    },
  ];

  private paymentCards = [
    {
      id: '1',
      title: 'Humo ****4521',
      subtitle: 'Humo',
      gradient: 'bg-gradient-to-r from-blue-600 to-purple-600',
    },
    {
      id: '2',
      title: 'UzCard ****7890',
      subtitle: 'UzCard',
      gradient: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    },
  ];

  private securitySettings = {
    biometricEnabled: true,
    lastPasswordChange: '2024-03-29',
    twoFactorEnabled: false,
  };

  private connectedDevices = [
    { id: '1', name: 'iPhone 15', type: 'smartphone', lastActive: '2024-04-28' },
    { id: '2', name: 'MacBook Pro', type: 'laptop', lastActive: '2024-04-27' },
  ];

  private wearables = [
    { id: '1', name: 'Apple Watch', type: 'watch', synced: true, lastSync: '2024-04-28T10:30:00Z' },
    { id: '2', name: 'Mi Band 7', type: 'band', synced: false, lastSync: '2024-04-25T08:15:00Z' },
  ];

  // Profile methods
  getProfile() {
    return this.profile;
  }

  updateProfile(updateProfileDto: any) {
    this.profile = { ...this.profile, ...updateProfileDto };
    return this.profile;
  }

  // Avimed Pass methods
  getAvimedPass() {
    return this.avimedPass;
  }

  updateAvimedPass(updateAvimedPassDto: any) {
    this.avimedPass = { ...this.avimedPass, ...updateAvimedPassDto };
    return this.avimedPass;
  }

  // Documents methods
  getDocuments() {
    return this.documents;
  }

  addDocument(addDocumentDto: any) {
    const newDocument = {
      id: String(this.documents.length + 1),
      ...addDocumentDto,
    };
    this.documents.push(newDocument);
    return newDocument;
  }

  updateDocument(id: string, updateDocumentDto: any) {
    const index = this.documents.findIndex((doc) => doc.id === id);
    if (index !== -1) {
      this.documents[index] = { ...this.documents[index], ...updateDocumentDto };
      return this.documents[index];
    }
    return null;
  }

  deleteDocument(id: string) {
    const index = this.documents.findIndex((doc) => doc.id === id);
    if (index !== -1) {
      this.documents.splice(index, 1);
      return { success: true };
    }
    return { success: false };
  }

  // Payment cards methods
  getPaymentCards() {
    return this.paymentCards;
  }

  addPaymentCard(addPaymentCardDto: any) {
    const newCard = {
      id: String(this.paymentCards.length + 1),
      ...addPaymentCardDto,
    };
    this.paymentCards.push(newCard);
    return newCard;
  }

  deletePaymentCard(id: string) {
    const index = this.paymentCards.findIndex((card) => card.id === id);
    if (index !== -1) {
      this.paymentCards.splice(index, 1);
      return { success: true };
    }
    return { success: false };
  }

  // Security methods
  getSecuritySettings() {
    return {
      ...this.securitySettings,
      devices: this.connectedDevices,
      wearables: this.wearables,
    };
  }

  updateSecuritySettings(updateSecurityDto: any) {
    this.securitySettings = { ...this.securitySettings, ...updateSecurityDto };
    return this.securitySettings;
  }

  changePassword(changePasswordDto: any) {
    // In real app, validate old password and hash new one
    this.securitySettings.lastPasswordChange = new Date().toISOString().split('T')[0];
    return { success: true, message: 'Parol muvaffaqiyatli o\'zgartirildi' };
  }

  toggleBiometric(toggleBiometricDto: any) {
    this.securitySettings.biometricEnabled = toggleBiometricDto.enabled;
    return { success: true, biometricEnabled: this.securitySettings.biometricEnabled };
  }

  // Connected devices methods
  getConnectedDevices() {
    return this.connectedDevices;
  }

  removeDevice(id: string) {
    const index = this.connectedDevices.findIndex((device) => device.id === id);
    if (index !== -1) {
      this.connectedDevices.splice(index, 1);
      return { success: true };
    }
    return { success: false };
  }

  // Wearables methods
  getWearables() {
    return this.wearables;
  }

  syncWearable(id: string) {
    const wearable = this.wearables.find((w) => w.id === id);
    if (wearable) {
      wearable.synced = true;
      wearable.lastSync = new Date().toISOString();
      return { success: true, wearable };
    }
    return { success: false };
  }
}
