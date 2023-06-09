"use client";
import WithAuth from "app/components/WithAuth";
import UIWrapper from "app/components/UIWrapper";

function Challenges() {
  return (
    <UIWrapper>
      <h1>Challenges</h1>
    </UIWrapper>
  );
}

export default () => <WithAuth WrappedComponent={Challenges} />;
