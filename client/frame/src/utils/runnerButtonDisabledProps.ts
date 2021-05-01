import dayjs from 'dayjs';
import { PackageType } from '../views/PackageView';

export default {
  isDisabled: (pckg?: PackageType, token?: string): boolean => {
    return (pckg?.needsAuth && !token) || !pckg?.isActive ||
    dayjs(pckg?.availableFrom).isAfter(dayjs()) || dayjs(pckg?.availableTo).isBefore(dayjs());
  },
  getDisabledMessage: (pckg?: PackageType, token?: string): string => {
    if (pckg?.needsAuth && !token) {
      return 'A futtatáshoz be kell lépni!';
    }
    if (!pckg?.isActive) {
      return 'A csomag nincsen aktiválva!';
    }

    if (dayjs(pckg?.availableFrom).isAfter(dayjs())) {
      return 'A csomag még nem elérhető!';
    }

    if (dayjs(pckg?.availableTo).isBefore(dayjs())) {
      return 'A csomag már nem elérhető!';
    }

    return 'Teszt futtatása';
  }
};