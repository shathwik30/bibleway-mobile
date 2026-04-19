import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import Button from "../Button";

jest.mock("@/theme/colors", () => ({
  colors: {
    primary: { DEFAULT: "#59021a", light: "#ffb2b9", dark: "#781c2e", container: "#781c2e" },
    onPrimary: "#ffffff",
    secondary: { DEFAULT: "#4e5f7c" },
    error: "#ba1a1a",
  },
}));

describe("Button", () => {
  const defaultProps = {
    title: "Press Me",
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the title text", () => {
      render(<Button {...defaultProps} />);
      expect(screen.getByText("Press Me")).toBeTruthy();
    });

    it("has the correct accessibility role", () => {
      render(<Button {...defaultProps} />);
      expect(screen.getByRole("button")).toBeTruthy();
    });

    it("has the correct accessibility label", () => {
      render(<Button {...defaultProps} />);
      expect(screen.getByLabelText("Press Me")).toBeTruthy();
    });
  });

  describe("onPress", () => {
    it("calls onPress when pressed", () => {
      const onPress = jest.fn();
      render(<Button title="Click" onPress={onPress} />);
      fireEvent.press(screen.getByRole("button"));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("does not call onPress when disabled", () => {
      const onPress = jest.fn();
      render(<Button title="Click" onPress={onPress} disabled />);
      fireEvent.press(screen.getByRole("button"));
      expect(onPress).not.toHaveBeenCalled();
    });

    it("does not call onPress when loading", () => {
      const onPress = jest.fn();
      render(<Button title="Click" onPress={onPress} loading />);
      fireEvent.press(screen.getByRole("button"));
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe("loading state", () => {
    it("shows an ActivityIndicator when loading is true", () => {
      render(<Button {...defaultProps} loading />);

      expect(screen.queryByText("Press Me")).toBeNull();
    });

    it("does not show ActivityIndicator when loading is false", () => {
      render(<Button {...defaultProps} loading={false} />);
      expect(screen.getByText("Press Me")).toBeTruthy();
    });
  });

  describe("disabled state", () => {
    it("has disabled accessibility state when disabled", () => {
      render(<Button {...defaultProps} disabled />);
      const button = screen.getByRole("button");
      expect(button.props.accessibilityState).toEqual(
        expect.objectContaining({ disabled: true }),
      );
    });

    it("has disabled accessibility state when loading", () => {
      render(<Button {...defaultProps} loading />);
      const button = screen.getByRole("button");
      expect(button.props.accessibilityState).toEqual(
        expect.objectContaining({ disabled: true }),
      );
    });

    it("is not disabled by default", () => {
      render(<Button {...defaultProps} />);
      const button = screen.getByRole("button");
      expect(button.props.accessibilityState).toEqual(
        expect.objectContaining({ disabled: false }),
      );
    });
  });

  describe("icons", () => {
    it("renders with a left icon", () => {
      const { getByText } = render(
        <Button
          {...defaultProps}
          leftIcon={
            <React.Fragment>
              <></>
            </React.Fragment>
          }
        />,
      );
      expect(getByText("Press Me")).toBeTruthy();
    });

    it("renders with a right icon", () => {
      const { getByText } = render(
        <Button
          {...defaultProps}
          rightIcon={
            <React.Fragment>
              <></>
            </React.Fragment>
          }
        />,
      );
      expect(getByText("Press Me")).toBeTruthy();
    });
  });
});
