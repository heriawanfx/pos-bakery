import { useState } from "react";
import { ThemeToggle } from "../components/ThemeToggle";
import { Card, CardHeader, CardBody, CardFooter } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Modal } from "../components/ui/Modal";

function DemoPage() {
  const [open, setOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <Card className="max-w-xl w-full p-6 space-y-4">
        <CardHeader
          title="PoS Bakery – UI Kit Demo"
          description="Testing the design system (Button, Card, Input, Select, Modal, ThemeToggle)."
          actions={<ThemeToggle />}
        />

        <CardBody>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Nastar 250g"
              hint="Example of Input component"
            />

            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              hint="Example of Select component"
            >
              <option value="">Choose category…</option>
              <option value="cookies">Dry cookies</option>
              <option value="cakes">Cakes</option>
              <option value="others">Others</option>
            </Select>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => setOpen(true)}>Primary Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Delete</Button>
          </div>
        </CardBody>

        <CardFooter>
          <Button variant="secondary">Cancel</Button>
          <Button>Save</Button>
        </CardFooter>
      </Card>

      <Modal
        title="Modal example"
        open={open}
        onClose={() => setOpen(false)}
      >
        <p className="text-sm text-muted-foreground">
          This is a basic modal using the card theme and semantic colors.
        </p>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => setOpen(false)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
}

export default DemoPage;
