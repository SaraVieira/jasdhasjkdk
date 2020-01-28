import React from "react";

import { rhythm, scale } from "../utils/typography";

class Layout extends React.Component {
  render() {
    const { title, children } = this.props;

    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`
        }}
      >
        <div className="alert">
          Have feedback? I would love if you could leave it in this{" "}
          <a
            style={{
              color: "white",
              textDecoration: "underline"
            }}
            href="https://paper.dropbox.com/doc/Book-Feedback-UTre4F5XcTp3yKwK315zB"
          >
            dropbox paper
          </a>
        </div>
        <header>
          <h1
            className="title"
            style={{
              ...scale(1.5),
              marginBottom: rhythm(1.5),
              marginTop: 0
            }}
          >
            {title}
          </h1>
        </header>
        <main>{children}</main>
      </div>
    );
  }
}

export default Layout;
