import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach, type Mock } from "vitest";
import PhotosPage from "@/pages/photoPage";
import {
  fetchPhotosApi,
  createPhotoApi,
  updatePhotoApi,
  deletePhotoApi,
} from "@/services/api";

// Mock the API
vi.mock("@/services/api", () => ({
  fetchPhotosApi: vi.fn(),
  createPhotoApi: vi.fn(),
  updatePhotoApi: vi.fn(),
  deletePhotoApi: vi.fn(),
}));

describe("PhotosPage Create", () => {
  const initialPhotos = [
    {
      id: 1,
      title: "Sunset",
      photo_category: "Nature",
      camera_brand: "Canon",
      gear_used: "Tripod",
      photo_taken: new Date().toISOString(),
      photo_path: "",
    },
    {
      id: 2,
      title: "Beach",
      photo_category: "Travel",
      camera_brand: "Sony",
      gear_used: "Drone",
      photo_taken: new Date().toISOString(),
      photo_path: "",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Create a new photo", async () => {
    // Step 1: initial photos
    (fetchPhotosApi as Mock).mockResolvedValueOnce(initialPhotos);

    // Step 2: render component
    render(<PhotosPage />);

    await waitFor(() => {
      expect(screen.getByText("Sunset")).toBeInTheDocument();
    });

    // Step 3: mock create API
    const newPhoto = {
      id: 3,
      title: "Mountain",
      photo_category: "Nature",
      camera_brand: "Nikon",
      gear_used: "Tripod",
      photo_taken: new Date().toISOString(),
      photo_path: "photos/mountain.jpg", // added photo_path
    };
    (createPhotoApi as Mock).mockResolvedValue({
      success: true,
      data: newPhoto,
    });

    // Step 4: prepare FormData for create
    const formData = new FormData();
    formData.append("title", "Mountain");
    formData.append("photo_category", "Nature");
    formData.append("camera_brand", "Nikon");
    formData.append("gear_used", "Tripod");
    formData.append("photo_taken", new Date().toISOString());
    formData.append("photo_path", "photos/mountain.jpg"); // include photo path

    await createPhotoApi(formData);

    // Step 5: simulate refetch returning the new photo list
    (fetchPhotosApi as Mock).mockResolvedValueOnce([
      ...initialPhotos,
      newPhoto,
    ]);
    render(<PhotosPage />);

    // Step 6: assert new photo appears
    await waitFor(() => {
      expect(screen.getByText("Mountain")).toBeInTheDocument();
      // optionally assert the image exists
      const img = screen.getByAltText(
        "Photo titled Mountain",
      ) as HTMLImageElement;
      expect(img.src).toContain("photos/mountain.jpg");
    });
  });
});
