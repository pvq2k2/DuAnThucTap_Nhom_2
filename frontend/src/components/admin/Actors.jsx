/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { BsTrash, BsPencilSquare } from "react-icons/bs";
import { getActors } from "../../api/actor";
import { useNotification } from "../../hooks";

let pageNo = 0;
const limit = 20;

export default function Actors() {
  const [actors, setActors] = useState([]);
  const { updateNotification } = useNotification();

  const fetchActors = async () => {
    const { profiles, error } = await getActors(pageNo, limit);
    if (error) return updateNotification("error", error);

    setActors([...profiles]);
  };

  useEffect(() => {
    fetchActors();
  }, []);
  return (
    <div className="grid grid-cols-4 gap-5 p-5">
      {actors.map((actor) => {
        return <ActorProfile profile={actor} key={actor.id} />;
      })}
    </div>
  );
}

const ActorProfile = ({ profile }) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleOnMouseEnter = () => {
    setShowOptions(true);
  };
  const handleOnMouseLeave = () => {
    setShowOptions(false);
  };

  if (!profile) return null;
  const { name, avatar, about = "" } = profile;
  return (
    <div className="bg-white shadow dark:shadow dark:bg-secondary rounded h-20 overflow-hidden ">
      <div
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        className="flex cursor-pointer relative"
      >
        <img
          src={avatar}
          alt={name}
          className="w-20 aspect-square object-cover"
        />

        <div className="px-2">
          <h1 className="text-xl text-primary dark:text-white font-semibold">
            {name}
          </h1>
          <p className="text-primary dark:text-white">
            {about.substring(0, 50)}
          </p>
        </div>

        <Options visible={showOptions} />
      </div>
    </div>
  );
};

const Options = ({ visible, onDeleteClick, onEditClick }) => {
  if (!visible) return null;
  return (
    <div className="absolute inset-0 bg-primary bg-opacity-25 backdrop-blur-sm flex justify-center items-center space-x-5">
      <button
        onClick={onDeleteClick}
        className="p-2 rounded-full bg-white text-primary hover:opacity-80 transition"
        type="button"
      >
        <BsTrash />
      </button>
      <button
        onClick={onEditClick}
        className="p-2 rounded-full bg-white text-primary hover:opacity-80 transition"
        type="button"
      >
        <BsPencilSquare />
      </button>
    </div>
  );
};
