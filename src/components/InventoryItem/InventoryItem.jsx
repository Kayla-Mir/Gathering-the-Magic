import { useState } from "react";
import { useDispatch } from "react-redux";

//modal settings
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
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

    // const addToInventory = () => {
    //     let cardToAdd = {
    //         img_url: item.image_uris?.normal ?? item.card_faces[0]?.image_uris?.normal,
    //         img_back_url: null,
    //         name: item.name,
    //         toughness: item.toughness ?? null,
    //         toughness_back: null,
    //         power: item.power ?? null,
    //         power_back: null,
    //         cmc: item.cmc,
    //         set: item.set,
    //         color_identity: item.color_identity,
    //         type_line: item.type_line,
    //         legality: item.legalities.commander
    //     }
    //     if (!item.image_uris) {
    //         cardToAdd = {
    //             ...cardToAdd, 
    //             img_back_url: item.card_faces[1].image_uris.normal,
    //         }
    //     }
    //     if (item.card_faces) {
    //         cardToAdd = {
    //             ...cardToAdd,
    //             toughness: item.card_faces[0]?.toughness,
    //             toughness_back: item.card_faces[1]?.toughness,
    //             power: item.card_faces[0]?.power,
    //             power_back: item.card_faces[1]?.power,
    //         }
    //     }
    //     dispatch({
    //         type: 'ADD_TO_INVENTORY',
    //         payload: cardToAdd
    //     })
    // }

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