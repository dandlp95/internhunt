import React from "react";

const HelloWorld = () => {
  return (
    <div>
      <h3>Hello World</h3>
      <p>My name is Daniel</p>
    </div>
  );
};

const HelloWorldPage = () => {
  return (
    <div>
      <section>
        <h2>This is a ReactJs example</h2>
        <HelloWorld />
      </section>
    </div>
  );
};

export default HelloWorldPage;