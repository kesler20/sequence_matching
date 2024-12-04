import React from "react";
import styled, { keyframes } from "styled-components";

export default function LoadingSpinner(props: { size?: number }) {
  const rotate = keyframes`
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  `;

  const fadeIn = keyframes`
    0%,100% { opacity: 0.2 }
    50% { opacity: 0.5 }
  `;

  const Spinner = styled.div`
    border: 8px solid #03c9d7;
    border-top: 8px solid #3498db;
    border-radius: 50%;
    width: ${props.size}px; // Use the size prop here
    height: ${props.size}px; // Use the size prop here
    animation: ${rotate} 2s linear infinite;
  `;

  const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    animation: ${fadeIn} 2s infinite;
  `;

  return (
    <Container>
      <Spinner />
    </Container>
  );
}
