export type WeatherJson = {
  records: {
    Locations: Location[];
  };
};

export type Location = {
  Location: LocationDetail[];
};

export type LocationDetail = {
  LocationName: string;
  WeatherElement: WeatherElement[];
};

export type WeatherElement = {
  ElementName: string;
  Time: TimePeriod[];
};

export type TimePeriod = {
  StartTime: string;
  EndTime: string;
  ElementValue: ElementValue[];
};

export type ElementValue = {
  WeatherDescription: string;
};
