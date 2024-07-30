import { Button, Center, Flex } from "@chakra-ui/react";
import React from "react";
import { NavLink } from "react-router-dom";

export default function Navigation() {
  return (
    <Center margin={5}>
      <Flex>
        <Button margin={2}>
          <NavLink
            to="/"
            style={({ isActive }) => {
              return isActive ? { color: "orange" } : { color: "gray" };
            }}
          >
            Home
          </NavLink>
        </Button>

        <Button margin={2}>
          <NavLink
            to="/about"
            style={({ isActive }) => {
              return isActive ? { color: "orange" } : { color: "gray" };
            }}
          >
            About
          </NavLink>
        </Button>

        <Button margin={2}>
          <NavLink
            to="/error"
            style={({ isActive }) => {
              return isActive ? { color: "orange" } : { color: "gray" };
            }}
          >
            Force Error
          </NavLink>
        </Button>
      </Flex>
    </Center>
  );
}
