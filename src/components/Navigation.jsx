import React from "react";
import { NavLink } from "react-router-dom";
import {
  Center,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@chakra-ui/react";

export default function Navigation() {
  return (
    <Center>
      <Breadcrumb separator=" | ">
        <BreadcrumbItem >
          <BreadcrumbLink as={NavLink} to="/">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink as={NavLink} to="/about">
            About
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    </Center>
  );
}
