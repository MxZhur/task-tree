import React from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  GRAPH_COLORING_MODES,
  selectSettings,
  setDescriptionExpandedByDefault,
  setGraphColoringMode,
} from "../../store/settingsSlice";

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const defaultSettings = useAppSelector(selectSettings);

  const toggleDescriptionExpandedByDefault = () => {
    dispatch(
      setDescriptionExpandedByDefault(
        !defaultSettings.descriptionExpandedByDefault
      )
    );
  };

  const onGraphColoringModeChange = (newValue: string) => {
    dispatch(setGraphColoringMode(newValue));
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Container style={{ height: "100%" }}>
      <div
        className="mb-4 mt-4"
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center",
        }}
      >
        <div className="mb-4">
          <h1>{t("settings")}</h1>
        </div>

        <Form.Group>
          <Form.Check
            checked={defaultSettings.descriptionExpandedByDefault}
            label={t("settingsPage.descriptionExpandedByDefault")}
            onChange={toggleDescriptionExpandedByDefault}
          />
        </Form.Group>

        <Form.Group className="mt-4">
          <Form.Label>{t("settingsPage.graphColoringMode.label")}</Form.Label>
          <Form.Select
            value={defaultSettings.graphColoringMode}
            onChange={(e) => onGraphColoringModeChange(e.target.value)}
          >
            <option value={GRAPH_COLORING_MODES.priority}>
              {t("settingsPage.graphColoringMode.priority")}
            </option>
            <option value={GRAPH_COLORING_MODES.difficulty}>
              {t("settingsPage.graphColoringMode.difficulty")}
            </option>
            <option value={GRAPH_COLORING_MODES.progress}>
              {t("settingsPage.graphColoringMode.progress")}
            </option>
            <option value={GRAPH_COLORING_MODES.dependencies}>
              {t("settingsPage.graphColoringMode.dependencies")}
            </option>
            <option value={GRAPH_COLORING_MODES.off}>
              {t("settingsPage.graphColoringMode.off")}
            </option>
          </Form.Select>
        </Form.Group>

        <div className="mt-4">
          <Button onClick={goBack}>{t("back")}</Button>
        </div>
      </div>
    </Container>
  );
};

export { SettingsPage };
