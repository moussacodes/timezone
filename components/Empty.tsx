"use client";
import { addMember } from "@/redux/features/memberSlice";
import { ThemeIcon } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import React from "react";
import { useDispatch } from "react-redux";

function Empty() {
  const dispatch = useDispatch();

  const addNewMember = () => {
    dispatch(addMember());
  };
  return (
    <div className="px-4 glass flex flex-row jus justify-between items-center mx-10 py-2">
      <h1 className="text-black">Add new person</h1>
      <ThemeIcon
        size={32}
        color="rgba(108, 106, 106, 0.8)"
        className="cursor-pointer"
        onClick={addNewMember}
      >
        <IconPlus size="1.05rem" stroke={1.5} />
      </ThemeIcon>
    </div>
  );
}

export default Empty;
