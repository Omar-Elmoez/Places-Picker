import { useEffect, useRef, useState } from "react";
import { Modal, DeleteConfirmation, Places } from "./components/index.js";
import { AVAILABLE_PLACES } from "./data.js";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
const relatedPlaces = AVAILABLE_PLACES.filter((place) =>
  storedIds.includes(place.id)
);

function App() {
  const selectedPlace = useRef();
  const [isModalOpen, setisModalOpen] = useState(false);
  const [places, setPlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(relatedPlaces);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude: lat, longitude: lon } = coords;
        setPlaces(sortPlacesByDistance(AVAILABLE_PLACES, lat, lon));
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          // Handle the refused permission case here
          setPlaces(AVAILABLE_PLACES);
        }
      }
    );
  }, []);

  function handleStartRemovePlace(id) {
    setisModalOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setisModalOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const selectedIds =
      JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    if (selectedIds.indexOf(id) === -1) {
      localStorage.setItem(
        "selectedPlaces",
        JSON.stringify([id, ...selectedIds])
      );
    }
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setisModalOpen(false);

    const currentStorageIds = JSON.parse(
      localStorage.getItem("selectedPlaces")
    );
    const updatedStorageIds = currentStorageIds.filter(
      (id) => id !== selectedPlace.current
    );
    localStorage.setItem("selectedPlaces", JSON.stringify(updatedStorageIds));
  }

  return (
    <>
      <Modal open={isModalOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={places}
          fallbackText="Allow location permission to display places sorted by distance ..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
