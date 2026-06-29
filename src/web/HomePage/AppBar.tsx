import React, { useRef, useState } from "react";
import {
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  Box,
  ClickAwayListener,
  Grow,
  MenuList,
  Paper,
  Popper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";
import { PORTALS } from "../../App";

export type AppBarProps = MuiAppBarProps & {
  centered?: boolean;
};

const StyledAppBar = styled(MuiAppBar)<{ centered?: boolean }>(
  ({ centered }) => ({
    backgroundColor: "#ffffff",
    color: "#000000",
    alignItems: centered ? "center" : "left",
  })
);

const NavText = styled(Typography)({
  fontFamily: "Roboto",
  fontSize: "14px",
  fontWeight: 400,
  lineHeight: "20px",
  letterSpacing: "0.1px",
  cursor: "pointer",
});

const DropDownMenu = styled(Paper)({
  boxShadow:
    "0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px rgba(0, 0, 0, 0.3)",
  borderRadius: "4px",
  backgroundColor: "#ffffff",
  textAlign: "center",
  width: "150px",
});

const PortalsMenuItem: React.FC<{
  onClick?: () => void;
  children?: React.ReactNode;
}> = ({ onClick, children }) => (
  <NavText
    variant="h6"
    onClick={onClick}
    sx={{ height: "48px", lineHeight: "24px", marginTop: "5px" }}
  >
    {children}
  </NavText>
);

const PortalsMenu: React.FC<{ onPortalClicked?: (index: number) => void }> = ({
  onPortalClicked,
}) => (
  <>
    <PortalsMenuItem onClick={() => onPortalClicked?.(0)}>
      Disease/Trait
    </PortalsMenuItem>
    <PortalsMenuItem onClick={() => onPortalClicked?.(1)}>
      Gene/b-cCRE
    </PortalsMenuItem>
    <PortalsMenuItem onClick={() => onPortalClicked?.(2)}>
      SNP/QTL
    </PortalsMenuItem>
    <PortalsMenuItem onClick={() => onPortalClicked?.(3)}>
      Single-Cell
    </PortalsMenuItem>
  </>
);

const DropDownMenuItem: React.FC<{
  menu: React.ReactNode;
  children?: React.ReactNode;
}> = ({ menu, children }) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <Stack direction="row">
      <div
        ref={anchorRef}
        style={{ cursor: "pointer" }}
        onMouseOver={() => setOpen(true)}
      >
        <NavText
          variant="h6"
          sx={{ display: "inline-block", marginRight: "7.25px" }}
        >
          {children}
        </NavText>
      </div>
      <ArrowDropDownIcon
        style={{ marginTop: "-3px", cursor: "pointer" }}
        onMouseOver={() => setOpen(true)}
      />
      {anchorRef.current && (
        <Popper
          anchorEl={anchorRef.current}
          open={open}
          placement="bottom-start"
          transition
          onMouseLeave={() => setOpen(false)}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom-start" ? "left top" : "left bottom",
              }}
            >
              <DropDownMenu>
                <ClickAwayListener onClickAway={() => setOpen(false)}>
                  <MenuList style={{ textAlign: "center" }}>{menu}</MenuList>
                </ClickAwayListener>
              </DropDownMenu>
            </Grow>
          )}
        </Popper>
      )}
    </Stack>
  );
};

const AppBar: React.FC<AppBarProps> = ({ centered, ...props }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar position="static" centered={centered} {...props}>
        <Toolbar sx={{ gap: 4 }}>
          <NavText
            variant="h6"
            onClick={() => navigate("/")}
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              fontSize: "20px",
              lineHeight: "15px",
            }}
          >
            psych
            <br />
            {" screen"}
          </NavText>
          <DropDownMenuItem
            menu={
              <PortalsMenu
                onPortalClicked={(index) =>
                  navigate(`/psychscreen${PORTALS[index][0]}`)
                }
              />
            }
          >
            Portals
          </DropDownMenuItem>
          <NavText
            variant="h6"
            onClick={() => navigate("/psychscreen/aboutus")}
          >
            About Us
          </NavText>
          <NavText
            variant="h6"
            onClick={() => navigate("/psychscreen/downloads")}
          >
            Downloads
          </NavText>
        </Toolbar>
      </StyledAppBar>
    </Box>
  );
};

export default AppBar;
