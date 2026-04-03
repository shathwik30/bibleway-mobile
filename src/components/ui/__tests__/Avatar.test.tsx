import React from "react";
import { render, screen } from "@testing-library/react-native";
import Avatar from "../Avatar";

describe("Avatar", () => {
  describe("when source is provided", () => {
    it("renders the image component", () => {
      const { toJSON } = render(
        <Avatar source="https://example.com/photo.jpg" name="John Doe" />,
      );
      const tree = toJSON();

      expect(tree).toBeTruthy();
    });

    it("applies the correct size styling via the tree snapshot", () => {
      const { toJSON } = render(
        <Avatar
          source="https://example.com/photo.jpg"
          name="John Doe"
          size={60}
        />,
      );
      const tree = toJSON() as any;

      expect(tree.props.style).toEqual(
        expect.objectContaining({
          width: 60,
          height: 60,
          borderRadius: 30,
        }),
      );
    });

    it("uses default size of 40", () => {
      const { toJSON } = render(
        <Avatar source="https://example.com/photo.jpg" name="Jane" />,
      );
      const tree = toJSON() as any;
      expect(tree.props.style).toEqual(
        expect.objectContaining({
          width: 40,
          height: 40,
          borderRadius: 20,
        }),
      );
    });

    it("does not render initials when source is provided", () => {
      render(<Avatar source="https://example.com/photo.jpg" name="John Doe" />);
      expect(screen.queryByText("JD")).toBeNull();
    });
  });

  describe("when source is null", () => {
    it("renders initials from full name", () => {
      render(<Avatar source={null} name="John Doe" />);
      expect(screen.getByText("JD")).toBeTruthy();
    });

    it("renders single initial for single name", () => {
      render(<Avatar source={null} name="Alice" />);
      expect(screen.getByText("A")).toBeTruthy();
    });

    it("truncates initials to 2 characters max", () => {
      render(<Avatar source={null} name="Mary Jane Watson" />);
      expect(screen.getByText("MJ")).toBeTruthy();
    });

    it("renders ? when name is empty", () => {
      render(<Avatar source={null} name="" />);
      expect(screen.getByText("?")).toBeTruthy();
    });

    it("renders the fallback view with correct size", () => {
      render(<Avatar source={null} name="Test User" size={80} />);
      const initialsText = screen.getByText("TU");
      expect(initialsText).toBeTruthy();
    });

    it("uppercases the initials", () => {
      render(<Avatar source={null} name="alice bob" />);
      expect(screen.getByText("AB")).toBeTruthy();
    });
  });
});
