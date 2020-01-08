<template>
  <div style="position: relative; height: 100%;">
    <div class="layout__page">
      <div class="layout__header">
        <timer />
      </div>
      <div class="layout__body">
        <div v-if="!notebooks.length && hasRequest"
             class="list-no-content-tip">
          时不我待，抓紧建个任务吧~
        </div>
        <van-list v-if="notebooks.length > 0"
                  v-model="loading"
                  :finished="finished"
                  finished-text="没有更多了"
                  :immediate-check="false"
                  @load="getNotebookList({ page: query.page + 1 })">
          <div v-for="(notebook, i) in notebooks"
               class="home__notebook-card-wrapper"
               :class="{ last: i === notebooks.length - 1 }"
               :key="notebook.id">
            <card :notebook="notebook"
                  @edit-notebook="handleEditNotebookClick"
                  @edit-note="handleEditNoteClick"
                  @toggle-done-status="toggleDoneStatus"
                  @update-note-order="updateNoteOrder"
                  @create-note="handleCreateNoteClick"></card>
          </div>
        </van-list>
      </div>
      <router-link class="home__button--create-notebook"
                   to="/home/notebook/create">
        <van-button type="primary"
                    size="normal"
                    icon="plus"
                    round>
          新建任务集
        </van-button>
      </router-link>
    </div>
    <transition>
      <router-view class="above-loaded-page" />
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { notebookInteractor, noteInteractor } from '@/core';
import LocalConfig from '@/config.json';
import { INotebook, INote } from '@/types';

import timer from './widgets/timer.vue';
import card from './widgets/card.vue';
import { NavBar, Button, List, Checkbox } from 'vant';

Vue.use(NavBar)
  .use(Button)
  .use(List)
  .use(Checkbox);

@Component({
  components: { timer, card }
})
export default class Home extends Vue {
  private notebooks: INotebook[] = [];

  private query = {
    page: 1,
    count: LocalConfig.ListQueryCount
  };

  private loading = false;

  private finished = false;

  private listTotal = 0;

  private hasRequest = false;

  private async getNotebookList(query: ListQuery) {
    try {
      this.query = Object.assign({}, this.query, query);

      const { data, total } = await notebookInteractor.getNotebookList(
        this.query
      );

      this.listTotal = total;

      if (this.query.page === 1) {
        this.notebooks = data;
      } else {
        this.notebooks = [...this.notebooks, ...data];
      }

      this.hasRequest = true;
      this.loading = false;
      if (this.notebooks.length >= this.listTotal) {
        this.finished = true;
      }

      this.hasRequest = true;
    } catch (error) {
      console.log(error);
    }
  }

  private async toggleDoneStatus(noteId: number, notebookId: number) {
    try {
      if (notebookId && noteId) {
        await noteInteractor.toggleDoneStatus(notebookId, noteId);
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async updateNoteOrder({ id, notes }: INotebook) {
    try {
      if (id && notes) {
        await notebookInteractor.updateNoteOrder(id, notes);
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async handleEditNotebookClick(id: number) {
    this.$router.push({
      name: 'notebook.create',
      query: {
        id: JSON.stringify(id)
      }
    });
  }

  private async handleCreateNoteClick(notebookId: number) {
    this.$router.push({
      name: 'note.create',
      query: {
        notebookId: JSON.stringify(notebookId)
      }
    });
  }

  private async handleEditNoteClick(noteId: number, notebookId: number) {
    this.$router.push({
      name: 'note.create',
      query: {
        id: JSON.stringify(noteId),
        notebookId: JSON.stringify(notebookId)
      }
    });
  }

  private async created() {
    this.$bus.on('notebook-change', () => {
      this.getNotebookList(this.query);
    });

    this.getNotebookList({ page: 1, count: LocalConfig.ListQueryCount });
  }
}
</script>

<style lang="less" scoped>
@import '~@/less/var.less';

.layout__header {
  padding: 60px 16px 40px 16px;
  background: @background-color;
}

.layout__body {
  padding: 16px;
}

.home__notebook-card-wrapper {
  margin-bottom: 30px;
  &:last-child {
    margin-bottom: 0;
  }
}

.home__button--create-notebook {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
