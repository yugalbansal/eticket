import { create } from 'zustand';
import api from '../services/api';

export interface EventPrice {
  general: number;
  vip: number;
  earlyBird?: number;
  group?: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: 'concert' | 'comedy' | 'sports' | 'theater' | 'festival';
  price: EventPrice;
  image: string;
  capacity: number;
  soldTickets: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  organizerId: string;
}

// Initial mock events
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Cold Play',
    description: 'The biggest music festival of the year',
    date: '2025-07-15',
    time: '14:00',
    venue: 'Delhi, India',
    category: 'concert',
    price: { general: 1, vip: 2, earlyBird: 1 },
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
    capacity: 1000,
    soldTickets: 0,
    status: 'upcoming',
    organizerId: 'default-organizer'
  },
  {
    id: '2',
    title: 'Stand-up Comedy Night',
    description: 'A night of laughter with top comedians',
    date: '2025-03-25',
    time: '20:00',
    venue: 'Chitkara University,Punjab',
    category: 'comedy',
    price: { general: 0, vip: 2, earlyBird: 0, group: 0 },
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca',
    capacity: 500,
    soldTickets: 0,
    status: 'upcoming',
    organizerId: 'default-organizer'
  },
  {
    id: '3',
    title: 'ICC MEN CHAMPIONSHIP',
    description: 'Experience the ultimate cricket showdown',
    date: 'Currently Live',
    time: '19:30',
    venue: 'Pakistan',
    category: 'sports',
    price: { general: 1, vip: 2, group: 1, earlyBird: 0 },
    image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a',
    capacity: 2000,
    soldTickets: 0,
    status: 'upcoming',
    organizerId: 'default-organizer'
  },
  {
    id: '4',
    title: 'Arjit Singh',
    description: 'A classic musical concert',
    date: '2025-04-15',
    time: '19:00',
    venue: 'Chandigarh',
    category: 'concert',
    price: { general: 1, vip: 2, earlyBird: 1, group: 0 },
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf',
    capacity: 800,
    soldTickets: 0,
    status: 'upcoming',
    organizerId: 'default-organizer'
  },
  {
    id: '5',
    title: 'Theater Night',
    description: 'An evening of dramatic performances',
    date: '2025-05-20',
    time: '18:30',
    venue: 'Mumbai Theater',
    category: 'theater',
    price: { general: 1, vip: 2, earlyBird: 1, group: 0 },
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf',
    capacity: 300,
    soldTickets: 0,
    status: 'upcoming',
    organizerId: 'default-organizer'
  },
  {
    id: '6',
    title: 'Summer Festival',
    description: 'A weekend of music, food, and fun',
    date: '2025-06-10',
    time: '12:00',
    venue: 'Bangalore Gardens',
    category: 'festival',
    price: { general: 2, vip: 4, earlyBird: 1.5, group: 1.5 },
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
    capacity: 5000,
    soldTickets: 0,
    status: 'upcoming',
    organizerId: 'default-organizer'
  }
];

interface EventState {
  events: Event[];
  loading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  addEvent: (event: Omit<Event, 'id' | 'soldTickets'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  getEventsByOrganizer: (organizerId: string) => Event[];
}

export const useEventStore = create<EventState>()((set, get) => ({
  events: mockEvents,
  loading: false,
  error: null,
  fetchEvents: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get('/events');
      const fetchedEvents = response.data;
      const allEvents = [...mockEvents];
      fetchedEvents.forEach((event: Event) => {
        if (!mockEvents.find(mock => mock.id === event.id)) {
          allEvents.push(event);
        }
      });
      set({ events: allEvents, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch events', loading: false });
    }
  },
  addEvent: async (eventData) => {
    try {
      set({ loading: true, error: null });
      const newEvent: Event = {
        ...eventData,
        id: `event_${Date.now()}`,
        soldTickets: 0
      };
      set((state) => ({
        events: [...state.events, newEvent],
        loading: false
      }));
      try {
        await api.post('/events', newEvent);
      } catch (error) {
        console.error('Failed to sync with backend:', error);
      }
    } catch (error) {
      set({ error: 'Failed to add event', loading: false });
      throw error;
    }
  },
  updateEvent: async (id, updatedEvent) => {
    try {
      set({ loading: true, error: null });
      set((state) => ({
        events: state.events.map((event) =>
          event.id === id ? { ...event, ...updatedEvent } : event
        ),
        loading: false
      }));
      try {
        await api.put(`/events/${id}`, updatedEvent);
      } catch (error) {
        console.error('Failed to sync with backend:', error);
      }
    } catch (error) {
      set({ error: 'Failed to update event', loading: false });
      throw error;
    }
  },
  deleteEvent: async (id) => {
    try {
      set({ loading: true, error: null });
      set((state) => ({
        events: state.events.filter((event) => event.id !== id),
        loading: false
      }));
      try {
        await api.delete(`/events/${id}`);
      } catch (error) {
        console.error('Failed to sync with backend:', error);
      }
    } catch (error) {
      set({ error: 'Failed to delete event', loading: false });
      throw error;
    }
  },
  getEventsByOrganizer: (organizerId) => 
    get().events.filter((event) => event.organizerId === organizerId || event.organizerId === 'default-organizer')
}));