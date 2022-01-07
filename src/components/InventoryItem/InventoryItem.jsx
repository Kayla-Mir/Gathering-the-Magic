import { useState } from "react";
import { useDispatch } from "react-redux";

//modal settings
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
// hover settings
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 340,
    textAlign: 'center',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} placement="right" />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));

function InventoryItem({ item }) {
    const [frontSide, setFrontSide] = useState(true);
    const dispatch = useDispatch();

    // modal settings
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const flipImage = () => {
        setFrontSide(!frontSide);
    }

    const deleteFromInventory = () => {
        dispatch({
            type: 'DELETE_FROM_INVENTORY',
            payload: item
        })
    }

    return (
        <div>
            <div>
                {/* <p onClick={handleOpen}>{item.name}</p> */}
                <HtmlTooltip
                    title={<img src={item.img_url} alt={item.name} />}
                >
                    <a onClick={handleOpen}>{item.name}</a>
                </HtmlTooltip>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <div>
                        <Box sx={style}>
                            {item.img_back_url !== null ?
                                <>
                                    <p>{item.name}</p>
                                    {frontSide ?
                                        <img src={item.img_url} alt={item.name} />
                                        :
                                        <img src={item.img_back_url} alt={item.name} />
                                    }
                                    <br />
                                    <button onClick={flipImage}>Flip</button>
                                </>
                                :
                                <>
                                    <p>{item.name}</p>
                                    <img src={item.img_url} alt={item.name} />
                                </>
                            }
                            <br />
                            <button onClick={deleteFromInventory}>Delete</button>
                        </Box>
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default InventoryItem;