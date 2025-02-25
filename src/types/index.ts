export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'organizer' | 'customer';
};

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: 'concert' | 'comedy' | 'sports' | 'theater' | 'festival';
  price: {
    general: number;
    vip: number;
    earlyBird?: number;
    group?: number;
  };
  image: string;
  organizer: string;
  status: 'upcoming' | 'ongoing' | 'completed';
};

export type Ticket = {
  id: string;
  eventId: string;
  userId: string;
  type: 'general' | 'vip' | 'earlyBird' | 'group';
  quantity: number;
  totalPrice: number;
  purchaseDate: string;
  status: 'active' | 'used' | 'refunded' | 'cancelled';
};