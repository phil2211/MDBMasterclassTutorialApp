import React from "react";
import { css } from "@emotion/react";

const FormRow = ({ children }) => {
    return (
        <div css={css`
            margin-bottom: 16px;
        `}
        >
            {children}
        </div>
    );
}

export default FormRow;