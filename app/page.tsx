import { Container } from "@mui/material";
import LocationForm from "@/components/LocationForm";

export default function Home() {
  return (
    <main>
      <Container maxWidth="md" sx={{ marginTop: "16px" }}>
        <LocationForm GOOGLE_MAPS_API_KEY={process.env.GOOGLE_MAPS_API_KEY} />
      </Container>
    </main>
  );
}
