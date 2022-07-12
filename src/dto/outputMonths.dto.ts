
interface valueDto {
    TotalData: Array<number>,
    LocatedData: Array<number>,
    RespondedData: Array<number>,
    PendingData: Array<number>
}


export interface outputMonthsDto {
    labels: Array<string>,
    values: valueDto
}