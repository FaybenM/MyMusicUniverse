import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const Albums = () => {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5051/api/albums") // fetch all albums
      .then((res) => {
        console.log("Fetched albums:", res.data); // check console
        setAlbums(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const albumColumns = useMemo(() => [
    {
      headerName: "Album",
      field: "name",
      cellRenderer: (params) => (
        <div style={{ textAlign: "center" }}>
          <img
            src={params.data.images?.[0]?.url || "https://via.placeholder.com/100"}
            alt={params.value}
            style={{ width: 100, height: 100, borderRadius: 6, marginBottom: 5 }}
          />
          <div style={{ fontWeight: "bold", color: "#950606" }}>{params.value}</div>
          <div style={{ fontSize: "0.85rem", color: "#333" }}>
            {params.data.artistName || "Unknown Artist"}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#666" }}>
            {params.data.release_date || "Unknown Date"}
          </div>
        </div>
      ),
      flex: 1,
      sortable: true,
      filter: true,
      resizable: true,
    }
  ], []);

  return (
    <div className="albums-page" style={{ width: "95%", margin: "0 auto", paddingTop: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#950606", marginBottom: 20 }}>
        Albums
      </h1>

      <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
        <AgGridReact
          rowData={albums}
          columnDefs={albumColumns}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
        />
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={() => (window.location.href = "/albums")}
          style={{
            backgroundColor: "#950606",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          View More Albums
        </button>
      </div>
    </div>
  );
};

export default Albums;
