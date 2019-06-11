const counterRoomsObject = (object) => {
    if(typeof object === 'object') {
        return Object.keys(object).length
    }
    return 0
}

export default counterRoomsObject;