import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AddRoom from "./AddRoom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

/**
 * EditRoom
 * This page reuses AddRoom component in EDIT mode.
 * Route: /edit-room/:id
 */
const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, loading } = useAuth();

  // Safety: if no id in URL, redirect
  useEffect(() => {
    if (!id) {
      navigate("/my-listings");
    }
  }, [id, navigate]);

  // Auth guard
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!token) {
    navigate("/login");
    return null;
  }

  // Reuse AddRoom (it already supports edit mode via useParams)
  return <AddRoom />;
};

export default EditRoom;
