"use client"
import {Category} from "@prisma/client";

interface IProps {
    category: Category
}
const CategoryRow = ({category}: IProps) => {
    return <div className={"flex items-center gap-2"}>
        <span role={"img"}>{category?.icon}</span>
        <span>{category?.name}</span>
    </div>
}

export default CategoryRow