import moment from 'moment'

const dateParser = (date: string): string => {
    return moment(date).format('YYYY-MM-DD');
}

export default dateParser;