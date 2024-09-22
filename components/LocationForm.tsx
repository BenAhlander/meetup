"use client";

import { Button, Grid2 as Grid, Paper, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import Card from "../components/LocationCard";
import LocationInput from "../components/inputs/LocationAutoFill";
import type { PlaceType } from "../components/inputs/LocationAutoFill";
import PlacesAutoFill from "../components/inputs/PlacesAutoFill";

interface LatLon {
  lat?: number;
  lng?: number;
}

interface LocationFormProps {
  GOOGLE_MAPS_API_KEY?: string;
}

const defaultPlace: PlaceType = {
  description: "",
  place_id: "",
  structured_formatting: {
    main_text: "",
    secondary_text: "",
  },
};

export default function LocationForm({
  GOOGLE_MAPS_API_KEY,
}: LocationFormProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [meetupLocations, setMeetupLocations] = useState<any[]>([]);
  const [place, setPlace] = useState<string>("");
  const [user1, setUser1] = useState<LatLon>({});
  const [user1Location, setUser1Location] = useState<PlaceType | null>(
    defaultPlace
  );
  const [user2, setUser2] = useState<LatLon>({});
  const [user2Location, setUser2Location] = useState<PlaceType | null>(
    defaultPlace
  );

  console.log(meetupLocations);

  const getLatLongFromLocationId = useCallback(
    async (locationId: string) => {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?place_id=${locationId}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      return data.results[0].geometry.location;
    },
    [GOOGLE_MAPS_API_KEY]
  );

  useEffect(() => {
    if (user1Location?.place_id) {
      getLatLongFromLocationId(user1Location.place_id).then((location) =>
        setUser1(location)
      );
    }
  }, [user1Location, getLatLongFromLocationId]);

  useEffect(() => {
    if (user2Location?.place_id) {
      getLatLongFromLocationId(user2Location.place_id).then((location) =>
        setUser2(location)
      );
    }
  }, [user2Location, getLatLongFromLocationId]);

  const handleFindMeetupLocations = () => {
    if (user1.lat && user1.lng && user2.lat && user2.lng && place) {
      const body = {
        user1,
        user2,
        category: place.toLowerCase(),
      };

      console.log({ body });

      fetch(
        "https://pqa8xw4m84.execute-api.us-east-2.amazonaws.com/getMeetupLocations",
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      )
        .then((response) => response.json())
        .then((data) => setMeetupLocations(data.meetupLocations))
        .catch((error) => console.error(error));
    }
  };

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <Typography variant="body2" sx={{ color: "error.main" }}>
        Please provide a Google Maps API key
      </Typography>
    );
  }

  return (
    <Paper sx={{ padding: "16px" }}>
      <Typography variant="h4" align="center">
        Location Meetup App
      </Typography>
      <br />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <LocationInput
            GOOGLE_MAPS_API_KEY={GOOGLE_MAPS_API_KEY}
            handleLocationSelect={(location) => setUser1Location(location)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <LocationInput
            GOOGLE_MAPS_API_KEY={GOOGLE_MAPS_API_KEY}
            handleLocationSelect={(location) => setUser2Location(location)}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <PlacesAutoFill setPlace={setPlace} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleFindMeetupLocations}
          >
            Find Meetup Locations
          </Button>
        </Grid>
      </Grid>
      <br />
      <Typography variant="h5" align="center">
        Meetup Locations
      </Typography>
      <br />
      {!!meetupLocations.length && (
        <Grid container spacing={2}>
          {meetupLocations.map(
            ({ travelTimeUser1, travelTimeUser2, places }) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return places.map((location: any) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={location.place_id}>
                  <Card
                    GOOGLE_MAPS_API_KEY={GOOGLE_MAPS_API_KEY}
                    place={location}
                    travelTimeUser1={travelTimeUser1}
                    travelTimeUser2={travelTimeUser2}
                  />
                </Grid>
              ));
            }
          )}
        </Grid>
      )}
    </Paper>
  );
}
