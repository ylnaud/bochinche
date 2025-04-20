import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import htmlmin from "html-minifier-terser";
import eleventyGoogleFonts from "eleventy-google-fonts";
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import pluginBundle from "@11ty/eleventy-plugin-bundle";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function (eleventyConfig) {
  // Archivos estáticos (excepto CSS/JS que los maneja Gulp)
  eleventyConfig.addPassthroughCopy("code/audio");
  eleventyConfig.addPassthroughCopy("code/img");
  eleventyConfig.addPassthroughCopy("code/svg");
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fortawesome/fontawesome-free/css/all.min.css":
      "css/fontawesome.css",
    "node_modules/@fortawesome/fontawesome-free/webfonts/**": "webfonts/",
  });

  eleventyConfig.setServerOptions({
    domDiff: false,
    showVersion: true,
  });

  eleventyConfig.addCollection("tags", function (collectionApi) {
    let tagsObj = {};
    collectionApi.getAll().forEach((item) => {
      if (!item.data.tags) return;
      item.data.tags.forEach((tag) => {
        if (!tagsObj[tag]) tagsObj[tag] = [];
        tagsObj[tag].push(item);
      });
    });
    return tagsObj;
  });

  eleventyConfig.addNunjucksAsyncShortcode(
    "svgIcon",
    async (src, className = "", title = "", desc = "") => {
      try {
        const filePath = path.join(__dirname, "code/svg", src);
        let svgContent = await fs.readFile(filePath, "utf-8");
        const idBase = src.replace(".svg", "").replace(/\W+/g, "-");

        svgContent = svgContent.replace(
          /<svg([^>]*)>/,
          `<svg class="${className}" role="img" aria-labelledby="${idBase}-title ${idBase}-desc" $1>`,
        );

        const seoMetadata = `
        <title id="${idBase}-title">${title}</title>
        <desc id="${idBase}-desc">${desc}</desc>
      `;
        svgContent = svgContent.replace("</svg>", `${seoMetadata}</svg>`);
        return svgContent;
      } catch (error) {
        console.error(`Error leyendo el SVG ${src}:`, error);
        return "";
      }
    },
  );

  eleventyConfig.addNunjucksAsyncShortcode("svgSprite", async () => {
    try {
      const svgDir = path.join(__dirname, "code/svg");
      const files = await fs.readdir(svgDir);
      let spriteContent = `<svg style="display: none;" xmlns="http://www.w3.org/2000/svg">`;

      for (const file of files) {
        if (file.endsWith(".svg")) {
          let svg = await fs.readFile(path.join(svgDir, file), "utf-8");
          const id = file.replace(".svg", "").replace(/\W+/g, "-");
          const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
          const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 24 24";
          svg = svg.replace(/<svg[^>]*>/, "").replace(/<\/svg>/, "");

          const title = `Title for ${id}`;
          const desc = `Description for ${id}`;

          spriteContent += `
          <symbol id="${id}" viewBox="${viewBox}" role="img" aria-labelledby="${id}-title ${id}-desc">
            <title id="${id}-title">${title}</title>
            <desc id="${id}-desc">${desc}</desc>
            ${svg}
          </symbol>`;
        }
      }

      spriteContent += `</svg>`;
      return spriteContent;
    } catch (error) {
      console.error("Error generando sprite de SVG:", error);
      return "";
    }
  });

  // Minificación de HTML en producción
  eleventyConfig.addTransform("htmlmin", function (content) {
    if ((this.page.outputPath || "").endsWith(".html")) {
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      });
    }
    return content;
  });

  // Plugins
  eleventyConfig.addPlugin(pluginBundle);
  eleventyConfig.addPlugin(eleventyGoogleFonts);
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp", "jpg"],
    widths: ["auto"],
    htmlOptions: {
      imgAttributes: {
        decoding: "async",
        loading: "lazy",
        width: "auto",
        height: "auto",
      },
      pictureAttributes: { class: "card-image" },
    },
  });

  return {
    dir: {
      input: "code",
      output: "docs",
    },
  };
}
