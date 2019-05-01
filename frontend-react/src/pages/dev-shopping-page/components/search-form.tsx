import * as React from "react";

export default ({ loading, fetch }) => (
  <form
    action="#"
    style={{ width: "100%" }}
    onSubmit={evt => {
      evt.preventDefault();
      const name = new FormData(evt.target as HTMLFormElement).get("name");
      if (!name) {
        return;
      }
      fetch(name);
    }}
  >
    <div className="input-group mb-3">
      <div className="input-group-prepend">
        <span className="input-group-text" style={{ minWidth: "85px" }}>
          User or Org
        </span>
      </div>
      <input
        name="name"
        autoFocus
        className="form-control"
        type="text"
        placeholder="e.g. omelhoro or Homebrew"
      />
      <div className="input-group-append">
        <button
          id="import-developer"
          className="btn btn-outline-secondary"
          type="submit"
          style={{
            display: "inline-flex",
            minWidth: "110px"
          }}
        >
          {loading ? (
            <i className="fa fa-spinner fa-spin" style={{ padding: "4px" }} />
          ) : (
            <i className="material-icons" style={{ marginRight: "4px" }}>
              search
            </i>
          )}
          <span>Search</span>
        </button>
      </div>
    </div>
  </form>
);
