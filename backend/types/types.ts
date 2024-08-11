type powerCutDetails = {
  id: number;
  shutDownDate: Date;
  town: string;
  location: string | null;
  substation: string;
  feeder: string;
  area_ids: string;
  createdAt: Date;
} | null;