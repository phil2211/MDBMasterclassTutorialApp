/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { uiColors } from "@leafygreen-ui/palette";

const Container = ({ children }) => {
    return (
        <div css={css`
            height: 100vh;
            justify-content: center;
            align-items: center;
            display: flex;
            flex-direction: column;
            background: ${uiColors.gray.light2};
        `}
        >
            {children}
        </div>
    );
}

export default Container;