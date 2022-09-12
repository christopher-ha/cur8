import wardrobeStyles from "@/styles/pages/Wardrobe.module.scss";

export default function Wardrobe(
  activeBlock,
  items,
  models,
  handleSelected,
  closeModal,
  modalType
) {
  return (
    <div>
      {activeBlock === "top1" ||
      activeBlock === "top2" ||
      activeBlock === "bottoms" ||
      activeBlock === "accessory1" ||
      activeBlock === "accessory2" ||
      activeBlock === "accessory3" ||
      activeBlock === "accessory4" ||
      activeBlock === "shoes" ? (
        <div className={wardrobeStyles.wardrobe}>
          <p>Hello</p>
          {items?.map((item) => {
            return (
              <div
                className={wardrobeStyles.wardrobe__item}
                key={item.id}
                onClick={() => {
                  handleSelected(item);
                  closeModal();
                }}
              >
                <img
                  className={wardrobeStyles.wardrobe__image}
                  src={item.url}
                  alt={item.description}
                />
                <div className={wardrobeStyles.wardrobe__text}>
                  <h5 className={wardrobeStyles.wardrobe__brand}>
                    {item.brand}
                  </h5>
                  <p className={wardrobeStyles.wardrobe__description}>
                    {item.description} — {item.size}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // If the activeBlock isn't any of those, then it must be the faces. Render the list of faces.
        <div className={wardrobeStyles.wardrobe}>
          {models?.map((model) => {
            return (
              <div
                className={wardrobeStyles.wardrobe__item}
                key={model.id}
                onClick={() => {
                  handleSelected(model);
                  closeModal();
                }}
              >
                <img
                  className={wardrobeStyles.wardrobe__image}
                  src={model.urlFace}
                  alt={model.name}
                />
                <div className={wardrobeStyles.wardrobe__text}>
                  <h5 className={wardrobeStyles.wardrobe__brand}>
                    {model.name}
                  </h5>
                  <p className={wardrobeStyles.wardrobe__description}>
                    {model.agency} — {model.instagram}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
