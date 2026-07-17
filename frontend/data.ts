import { Category } from './types';

export const categories: Category[] = [
  {
    id: 'c1',
    name: 'SUPERCARS',
    subtitle: 'High-performance masterpieces',
    image: require('./images/assets/Cars Category phot.png'),
    type: 'car'
  },
  {
    id: 'c2',
    name: 'REAL ESTATE',
    subtitle: 'Architectural excellence',
    image: require('./images/assets/Estates category photo.png'),
    type: 'estate'
  },
  {
    id: 'c3',
    name: 'YACHTS',
    subtitle: 'Ocean-bound freedom',
    image: require('./images/assets/Yachts Category photo.png'),
    type: 'yacht'
  },
  {
    id: 'c4',
    name: 'PRIVATE JETS',
    subtitle: 'Unmatched global reach',
    image: require('./images/assets/Jet homepage category photo.png'),
    type: 'jet'
  }
];
