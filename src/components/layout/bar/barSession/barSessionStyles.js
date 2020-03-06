export const styles = theme => ({
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')] : {
      display: 'flex',
      alignItems: 'center'
    }
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')] : {
      display: 'none'
    }
  },
  grow: {
    flexGrow: 1
  },
  avatarSize: {
    width: 40,
    height: 40
  },
  list : {
    width: 240
  },
  listItemText : {
    fontSize: "16px",
    fontWeight: 600,
    paddingLeft: "15px",
    color: "#212121"
  }
})