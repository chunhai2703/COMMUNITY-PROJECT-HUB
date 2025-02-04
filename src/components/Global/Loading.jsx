import { CircularProgress } from "@mui/material"

export const Loading= () => {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#E5E7EB",
                zIndex: 50,
            }}
        >
            <CircularProgress />
        </div>
    )
}